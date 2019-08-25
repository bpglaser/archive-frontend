pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploy Stage'
      }
    }
  }
}
