pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    environment {
        NODE_VERSION = '18.x'
        PNPM_VERSION = '9.0.0'
        CACHE_DIR = '.pnpm-store'
    }
    
    parameters {
        booleanParam(defaultValue: true, description: 'Run tests', name: 'RUN_TESTS')
        choice(choices: ['development', 'staging', 'production'], description: 'Deployment environment', name: 'DEPLOY_ENV')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    try {
                        git branch: 'main', 
                            url: 'https://github.com/ck-xmedia/vehicle-management.git'
                    } catch (Exception e) {
                        error "Failed to checkout repository: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    try {
                        nodejs(nodeJSInstallationName: 'NodeJS ' + NODE_VERSION) {
                            sh '''
                                npm install -g pnpm@${PNPM_VERSION}
                                pnpm config set store-dir ${CACHE_DIR}
                            '''
                        }
                    } catch (Exception e) {
                        error "Failed to setup Node.js environment: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS ' + NODE_VERSION) {
                    timeout(time: 10, unit: 'MINUTES') {
                        sh '''
                            pnpm install
                        '''
                    }
                }
            }
        }

        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS ' + NODE_VERSION) {
                    timeout(time: 15, unit: 'MINUTES') {
                        sh '''
                            pnpm build
                        '''
                    }
                }
            }
        }

        stage('Test') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS ' + NODE_VERSION) {
                    timeout(time: 10, unit: 'MINUTES') {
                        sh '''
                            pnpm test
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                patterns: [
                    [pattern: '**/node_modules/**', type: 'INCLUDE'],
                    [pattern: '**/.pnpm-store/**', type: 'INCLUDE'],
                    [pattern: '**/coverage/**', type: 'INCLUDE'],
                    [pattern: '**/dist/**', type: 'INCLUDE'],
                    [pattern: '**/.next/**', type: 'INCLUDE']
                ]
            )
        }
        success {
            emailext (
                subject: "Pipeline '${currentBuild.fullDisplayName}' SUCCESS",
                body: "Build completed successfully: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        failure {
            emailext (
                subject: "Pipeline '${currentBuild.fullDisplayName}' FAILED",
                body: "Build failed. Check console output at: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}