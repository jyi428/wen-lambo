pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      steps {
        git(url: 'https://github.com/jyi428/wen-lambo', branch: 'main')
      }
    }

    stage('Log') {
      parallel {
        stage('Log') {
          steps {
            sh 'ls -la'
          }
        }

        stage('Front- End Unit Test') {
          steps {
            sh 'npm i && npm run cypress'
          }
        }

      }
    }

    stage('Build') {
      steps {
        sh 'docker build -f'
      }
    }

  }
}