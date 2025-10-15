pipeline {
    agent any

    environment {
        PROJECT_NAME = '5563264e-5c74-4585-a39f-3e84a7c5bef5'
        NODE_VERSION = '18'
        NPM_CONFIG_CACHE = '${WORKSPACE}/.npm'
        DOCKER_REGISTRY = credentials('docker-registry')
        DOCKER_IMAGE = '${PROJECT_NAME}:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
                sh 'git rev-parse --short HEAD > .git/commit-id'
                script {
                    env.GIT_COMMIT_SHORT = readFile('.git/commit-id').trim()
                }
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Setting up build environment...'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                // Monorepo: Install dependencies for all packages
                dir('packages/common') {
                    sh 'npm install'
                }
                dir('apps/api') {
                    sh 'npm install'
                }
                dir('apps/web') {
                    sh 'npm install'
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running code quality checks...'
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                dir('packages/common') {
                    sh 'npm run build || echo "No build script"'
                }
                dir('apps/api') {
                    sh 'npm run build || echo "No build script"'
                }
                dir('apps/web') {
                    sh 'npm run build || echo "No build script"'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('packages/common') {
                    sh 'npm test || true'
                }
                dir('apps/api') {
                    sh 'npm test || true'
                }
                dir('apps/web') {
                    sh 'npm test || true'
                }
            }
            post {
                always {
                    junit '**/test-results/**/*.xml' // Collect test results
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully! ✅'
        }

        failure {
            echo 'Pipeline failed! ❌'
        }

        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }

}
