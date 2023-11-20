## Talent Standard Task Code Repository

This project will help interns at MVP Studio to understand how ReactJs, C# Web Api, MongoDb is used in Talent Code Architecture. 

Please follow the instructions below to understand how to get started. If you have any questions, please check if it has been asked on QuestionHub or raise the question there to get support. 

## Standard tasks

* Module 1 : Talent profile page
  * LinkedIn url & GitHub url
  * Description
  * User Details Component
  * Address
  * Nationality
  * Languages
  * Skills
  * Work experience
  * Visa status
  * Job seeking status
  * Photo upload

[Click here](http://git.mvp.studio/talent-standard-tasks/talent-standard-tasks/wikis/guides/standard-task-module1) for Module 1 details.

  * Module 2 : Talent Feed page
  * Front-end
    * Add ajax calls to retrieve data from the controllers
  * Back-end 
    * Build action methods in controllers and in services to fetch data from the database
	
[Click here](http://git.mvp.studio/talent-standard-tasks/talent-standard-tasks/wikis/guides/standard-task-module2) for Module 2 details.

### Launch Talent project
[Check the wiki](http://git.mvp.studio/talent-competition/talent-competition/wikis/guides/Starting-the-project) for more details.
* Get the latest source via Source Control Explorer
* Run webpack:
`cd C:\Talent\Talent\App\Talent.App.WebApp\wwwroot\js\react`
`npm run build`
* Launch Talent.WebApp project in Visual Studio. Register an account using your email address and log in.

### Project Structure  
[Check the wiki](http://git.mvp.studio/talent-competition/talent-competition/wikis/guides/project-structure) for more details.
 - Web Application:
    - `Talent.WebApp` : All frontend files are located here
 - Microservices:
    - `Talent.Services.Identity` : backend functions related to Login/Logout
    - `Talent.Services.Profile` : backend functions related to Profile
    - `Talent.Services.Talent` : backend functions related to Talent Matching, Jobs


### How to connect to the database
[Click here](http://git.mvp.studio/talent-competition/talent-competition/wikis/guides/mongo-db) for more details.
