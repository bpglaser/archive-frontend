pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm install --global'
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploy Stage'
      }
    }
  }
}
