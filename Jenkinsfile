pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /root/.pnpm-store:/root/.pnpm-store'
        }
    }

    environment {
        NODE_ENV = 'production'
        PNPM_HOME = '/root/.local/share/pnpm'
        PATH = "$PNPM_HOME:$PATH"
        HUSKY = '0'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deployment Environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip Test Execution')
    }

    stages {
        stage('Setup') {
            steps {
                sh 'corepack enable'
                sh 'corepack prepare pnpm@9.0.0 --activate'
                sh 'pnpm config set store-dir /root/.pnpm-store'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('Lint') {
            steps {
                sh 'pnpm run lint || true'
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
                    junit 'coverage/junit.xml'
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
                sh 'pnpm run build'
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

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            environment {
                DEPLOY_CREDS = credentials('deploy-credentials')
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'main' && params.DEPLOY_ENV == 'production') {
                        sh 'pnpm run deploy:prod'
                    } else if (env.BRANCH_NAME == 'staging' || params.DEPLOY_ENV == 'staging') {
                        sh 'pnpm run deploy:staging'
                    } else {
                        sh 'pnpm run deploy:dev'
                    }
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
                message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
        unstable {
            slackSend(
                color: 'warning',
                message: "Build Unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
            )
        }
    }
}