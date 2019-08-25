pipeline {
  agent any
  stages {
    stage('Install') {
      sh 'npm install'
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'pwd'
      }
    }
  }
}
