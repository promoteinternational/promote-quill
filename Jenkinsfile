#!groovy

pipeline {
  agent any

  stages {
    stage('Dependencies') {
      steps {
        sh '''#!/bin/bash -le
          npm install
          '''
      }
    }

    stage('Tests') {
      steps {
        sh '''#!/bin/bash -le
          npm test
          '''
      }
    }

    stage('Create package') {
      when {
        buildingTag()
      }
      steps {
        sh '''#!/bin/bash -le
          npm run dist
          '''
        archiveArtifacts artifacts: 'dist/promote-editor.js', fingerprint: true
      }
    }
  }
}
