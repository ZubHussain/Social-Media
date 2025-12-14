pipeline{
    agent any
    environment{
        SONAR_HOME= tool "Sonar"
    }
    stages{
        stage("Clone Code from Github"){
            steps{
                git url: "https://github.com/ZubHussain/Social-Media.git", branch: "devops"
            }
        }
         stage("SonarQube Quqlity Analysis"){
            steps{
                withSonarQubeEnv("Sonar"){
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=SocialMedia -Dsonar.projectKey=SocialMedia"
                }
            }
        }
         stage("OWASP Dependency Check"){
            steps{
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
         stage("Sonar Quality Gate Scan"){
             steps{
                 timeout(time: 2,unit: "MINUTES"){
                     waitForQualityGate abortPipeline: false
                 }
             }
         }
         stage("Trivy File System Scan"){
            steps{
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }
        stage("Deploy using Docker Compose"){
            steps {
               sh "docker-compose up --build"
            }
        }
    }
}
