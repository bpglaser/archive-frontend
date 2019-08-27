pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'pwd'
        sh 'whoami'
        sh 'rm -rf /var/www/html/*'
        sh 'cp -rf ./build/* /var/www/html/'
      }
    }
  }
}
