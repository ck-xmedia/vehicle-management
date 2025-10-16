pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18'
    }
    
    environment {
        PNPM_HOME = "${env.HOME}/.local/share/pnpm"
        PATH = "${env.PNPM_HOME}:${env.PATH}"
        NODE_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : 'development'}"
        DEPLOY_TARGET = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
    }

    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Deployment environment')
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g pnpm@9.0.0'
                sh 'pnpm --version'
                sh 'node --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'pnpm -r lint'
            }
        }

        stage('Test') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            steps {
                sh 'pnpm test'
            }
            post {
                always {
                    junit '**/junit.xml'
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm build'
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'main'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner \
                        -Dsonar.projectKey=vehicle-management \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,**/coverage/**,**/dist/**'
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                withCredentials([
                    string(credentialsId: 'STAGING_API_URL', variable: 'API_URL'),
                    file(credentialsId: 'staging-env', variable: 'ENV_FILE')
                ]) {
                    sh '''
                        cp $ENV_FILE apps/api/.env
                        cp $ENV_FILE apps/web/.env
                        pnpm --filter @parking/api deploy:staging
                        pnpm --filter @parking/web deploy:staging
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
                expression { return params.DEPLOY_ENV == 'production' }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'PROD_API_URL', variable: 'API_URL'),
                    file(credentialsId: 'prod-env', variable: 'ENV_FILE')
                ]) {
                    sh '''
                        cp $ENV_FILE apps/api/.env
                        cp $ENV_FILE apps/web/.env
                        pnpm --filter @parking/api deploy:prod
                        pnpm --filter @parking/web deploy:prod
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                color: 'good',
                message: "Build #${env.BUILD_NUMBER} succeeded on ${env.BRANCH_NAME}\nDeployed to: ${DEPLOY_TARGET}\n${env.BUILD_URL}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build #${env.BUILD_NUMBER} failed on ${env.BRANCH_NAME}\n${env.BUILD_URL}"
            )
        }
    }
}