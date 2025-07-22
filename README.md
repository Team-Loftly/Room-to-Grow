# Team Loftly (Room to Grow)
- Ted Lee
- Alex Luo
- Kathrina Pillay
- Aryan Sonik

  
Introducing Room to Grow, a productivity web app where users can build up healthy habits to grow and personalize their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

## Build Instructions:
- go to root directory, where docker-compose.yaml is located
- docker compose down -v
- docker compose up --build
- access the site at: http://localhost:3000.

## M4

### App Summary
Introducing Room to Grow, a productivity web app where users can build up healthy habits to grow and personalize their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

### Standard Goals
- Users can set different types of habits (timed, counted)
  - Current State: Complete
- Users have more flexibility with habits (organized by priority, etc.)
  - Current State: Complete
- Daily quest/reward system, productivity streaks that give bonus points, achievements, or other ways to reward consistent progress.
  - Current State: Complete
- Users gain access to “trends” in their productivity and view visualizations for every habit
  - Current State: Complete
- Users can add other users as friends by username  
  - Current State: Complete
- Interaction with certain elements of the app make noise
  - Current State: Complete

### Changes to Standard Goals
- Tasks are now referred to as habits. We made this change because we it fit the identity of our app better. As the aim of the app is to help users become more productive by gamifying habit tracking, it would make more sense for them to build healthy habits than to complete one off tasks.
- Instead of displaying overall trends in productivity, we decided it would be more useful to view trends in productivity per habit. This will allow users to track their progress for a specific habit, as some habits may be easier than maintain than others.

### Stretch Goals
- Users can rotate the room to view it freely
  - Current State: Complete
- Assets present in the room have idle animations (cat stretches occasionally, fairly lights twinkle, etc.)
  - Current State: TODO
- Users can view and visit each others’ rooms.
  - Current State: Complete
- Users can purchase more complex room decorations (weather changes, lighting changes, etc)
  - Current State: TODO
- Users can create several different room layouts and save them to quickly switch between them.
  - Current State: TODO
- Users can connect their spotify account to play music in their rooms.
  - Current State: TODO

### Non-Trivial Elements
| Feature                          | State     | Description                                                                            |
|----------------------------------|-----------|----------------------------------------------------------------------------------------|
| Habit tracking system            | Complete  | Users can create, update, and complete habits to earn coins.                           |
| Quest system                     | Complete  | Users can complete daily quests that reward consistent growth with coins.              |
| Item marketplace                 | Complete  | Users can purchase a variety of room decorations with their hard earned coins.         |
| ThreeJs room render & edit room  | Complete  | Users have a 3D study room that they can view and place purchased items in.            |
| Add friends and view their room  | Complete  | Users can add friends by username and view their rooms.                                |
| View metrics about habits        | Complete  | Users can view metrics about their habits.                                             |
| Pomodoro timer                   | Complete  | Users can activate a Pomodoro timer to boost their productivity.                       |

### XSS Security Assessment
This section covers the XSS security assessment conducted by our team. It will go over all of our site's input fields and tests we conducted by injecting javascript code into them.
Our tests:
- Test 1: Enter <script>alert('XSS')</script> into each of the input fields to see whether we can bypass our regular input handling workflow to instead run a malicious scrpt.
- Test 2: Enter "><img src=x onerror=alert('XSS')> into each of the input fields to test whether we can inject an image tag to our inputs and use its event handler to run a malicious script.
- Test 3: Enter &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt; into each of the input fields to test whether we can introduce a malicious script by user action (hovering in this case). This should also get through any checks for script tags as this uses a div.
Login and Registration Page:
- Username field:
  - Test 1:
    - Result: The user can successfully register and login with the username <script>alert('XSS')</script>. The input treats this entire script as a "name" and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 2:
    - Result: The user can successfully register and login with the username  "><img src=x onerror=alert('XSS')>. The input treats this entire script as a "name" and doesn't execute the script.
    - Mitigation Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 3: 
    - Result: The user can successfully register and login with the username &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt;. The input treats this entire script as a "name" and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
- Email address field: (Note for this test I put a@b.com at the end of each script to give it a valid email format).
  - Test 1:
    - Result: The email address input field blocks the use of "<" in the field and so clicking "register" or "login" does nothing except bring up a warning saying that the input contains an invalid character.
    - Mitigation Actions: None required as this is sufficent to stop this XSS attack.
  - Test 2:
    - Result: The email address input field blocks the use of ' " ' in the field and so clicking "register" or "login" does nothing except bring up a warning saying that the input contains an invalid character.
    - Mitigation Actions: None required as this is sufficent to stop this XSS attack.
  - Test 3:
    - Result: The email address input field blocks the use of "<" in the field and so clicking "register" or "login" does nothing except bring up a warning saying that the input contains an invalid character.
    - Mitigation Actions: None required as this is sufficent to stop this XSS attack.
- Password Field:
  - Test 1:
    - Result: The user can successfully register and login with <script>alert('XSS')</script> as a password. No alert script is executed.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 2:
    - Result: The user can successfully register and login with "><img src=x onerror=alert('XSS')> as a password. No alert script is executed.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 3:
    - Result: The user can successfully register and login with &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt;
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
Habits Page:
- New habit title field:
  - Test 1:
    - Result: The user can successfully create a habit with title <script>alert('XSS')</script>. The input treats this entire script as a title and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 2:
    - Result: The user can successfully create a habit with title "><img src=x onerror=alert('XSS')> . The input treats this entire script as a title and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 3:
    - Result: The user can successfully create a habit with title &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt;. The input treats this entire script as a title and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
- New habit description field:
  - Test 1:
    - Result: The user can successfully create a habit with description <script>alert('XSS')</script>. The input treats this entire script as a description and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 2:
    - Result: The user can successfully create a habit with description "><img src=x onerror=alert('XSS')> . The input treats this entire script as a description and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 3:
    - Result: The user can successfully create a habit with description &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt;. The input treats this entire script as a description and doesn't execute the script.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
Friends Page:
- Friend Username field:
  - Test 1:
    - Result: The user can successfully add <script>alert('XSS')</script> as a friend if that username exists. If not, the appropriate user not found error is shown. No script is executed.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 2:
    - Result: The user can successfully add "><img src=x onerror=alert('XSS')> as a friend if that username exists. If not, the appropriate user not found error is shown. No script is executed.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.
  - Test 3:
    - Result: The user can successfully add &lt;div onmouseover="alert('XSS')"&gt;Hover me&lt;div&gt; as a friend if that username exists. If not, the appropriate user not found error is shown. No script is executed.
    - Mitigation Actions: Added an onChange handler to the input to check the input against a regular expression "/[<>"'\/\\]/" and give an error if it includes any of these characters so they can't be entered.

### M4 highlights
- Usernames
  - User objects now must have a username in addition to an email and password.
  - This helps with the add friends feature as friends can be added by their username.
- Add friends and view their room!
  - Implemented a friends API to allow users to add each other as friends. Then, from the friends page they can view their friends' rooms using a new rooms API endpoint that fetches the room for a given username
- Daily quests
  - Users now earn the bulk of their coins through the completion of daily quests, which discourages abuse of the habits rewards system and improves the pacing of room development by rewarding continual growth
  - Users are assigned three quests each day that are linked to the progress and completion of habits
- Habits
  - Users can now sort habits alphabetically and by priority.
  - Users can filter habits by priority.
  - Grouped side buttons in habits page as a collapsible menu.
- Navbar
  - Added a profile dropdown icon with logout as a menu item.
  - Added text when hovering over buttons for a better user experience.
  - Added a quests button to allow users to go to daily quests.
  - Made coins a clickable button to navigate users to the marketplace.

### Bug List
- Our team uses Github Issues to document our bugs which can be found here: https://github.students.cs.ubc.ca/CPSC455-2025S/team02/issues

## M3

### Test Suite
- Our test suite is located in backend/test: https://github.students.cs.ubc.ca/CPSC455-2025S/team02/tree/Milestone3/backend/test
- We have created test suites for our API calls and operations, mocking real use-cases and scenarios for our application.
- Our testing tools:
  - Test env - Mocha + chai
  - Mocking database functions - sinon
  - Generating the report - mochawesome
  - simulating http reqs - supertest
- backend/test/testApp.js creates a separate test server instance with mocked auth helper functions.
- We use mochawesome to generate an html report of the tests in backend/mochawesome-report/mochawesome.html
- To run the tests:
  - cd backend
  - npm i
  - npm test
  - open backend/mochawesome-report/mochawesome.html in your browser to view the results

### Marketplace
- We've implemented our marketplace backend as follows:
  - There's a /decor API that returns marketplace items stored in our Decorations collection. Items in a seed file will populate the collection, and the API will fetch them from the database.
  - Market items are fetched when you navigate to the marketplace page and then stored in our marketSlice.
- Five new 3D models have been added that are availble for purchase and can be placed in users' rooms

### Habits backend
- The backend utilizes a dedicated Habit collection in the database. Each document in this collection maps a userId to a specific habit's details. This includes:
    - userId: Linking the habit to a particular user account.
    - title, description, days, priority, type, hours, minutes, checkmarks: Defining the habit's core properties and goals.
    - dailyStatuses: An embedded array of sub-documents that record the daily progress for the habit, including the date, status (complete, incomplete, skipped, failed), and value (e.g., minutes or checkmarks completed).
    - currentStreak: Tracks the consecutive days a habit has been completed.
    - lastStreakUpdateDate: Records when the streak was last updated.
- We've implemented our user habits state backend as follows:
  - There's a /habits API with the following endpoints:
      - GET /: This endpoint retrieves a user's habits for a specific date. If no date is provided, it defaults to the current day. It's used to display a user's daily habit list and their progress for that particular day.
      - GET /all: This endpoint fetches all habits associated with the authenticated user, without including their detailed daily status history. It's useful for displaying a comprehensive list of all habits a user has created.
      - POST /: This endpoint allows a user to create a new habit. It expects details such as the habit's title, description, scheduled days, priority, type (timed or checkmark), and goal-related values (hours/minutes for timed, checkmarks for checkmark).
      - PUT /:id: This endpoint updates an existing habit identified by its ID. Users can modify various habit attributes like title, description, scheduled days, priority, and type-specific goals.
      - DELETE /:id: This endpoint removes a habit from the user's collection, identified by its unique ID.
      - POST /:id/complete: This endpoint is used to record progress for a specific habit on the current day. For "timed" habits, it updates the minutes/hours completed, and for "checkmark" habits, it updates the count. It also automatically updates the habit's status (incomplete/complete) and streak based on the progress.
      - POST /:id/skip: This endpoint allows a user to mark a habit as "skipped" for the current day. This action affects the habit's streak calculation, typically preventing a break while not counting as completion.
      - POST /:id/fail: This endpoint marks a habit as "failed" for the current day. This action explicitly breaks the habit's current streak.
      - GET /:id/stats: This endpoint retrieves detailed statistics for a specific habit, including its current streak, total completed/failed/skipped days, total accumulated value (e.g., total minutes for timed habits), and daily values for the current week.

### Habits frontend
- Habits page has been reworked based on user feedback to provide a more streamlined and user-friendly UI.
- This includes allowing users to manage all the habits they created, not just for the currenty day.
- Having a view to allow users to see the habits they have scheduled for today.
- A more intuitive way to log progress (+/- icons for checkmarks, timer icon for timed habits).
- We replaced the general metrics component on the right half of the page with a habit stats component that shows the details of the habit that the user selected, such as their current streak, total completions, skipped, failed, etc.

### Rooms backend
- A users Rooms state will store a user's coins and the state of items the user owns in their room.
- We've implemented our user room state backend as follows:
  - There's a /rooms API with the following endpoints:
    - / -> gets the room state and coins for the user with the user id assoicated with the given JWT token.
    - /create -> creates a new rooms entry for the user with the user id assoicated with the given JWT token. This is called once when a user registers from the register page.
    - /update -> updates the rooms entry for the user with the user id assoicated with the given JWT token. This is called each time the user's rooms is updated -- coins added/removed, items purchased or placed/removed/modified.
      - The inventorySlice handles spendCoinsAndUpdate, addItemsAndUpdate, and addCoinsAndUpdate, which handle updating the redux state as well as sending an updateInventory request to the backend. Our components will call just these update functions.
      - The roomsSlice handles operations like modifying the position or rotation of an item, or placing/removing it from the room.
  - There's an Rooms collection that maps a user id to coins and decorations - used by our API to track the room state for each user.
- With this update, we can now create multiple user accounts and persist each user's room data independently.

### Rooms frontend
- The home page and edit room pages now are fully linked. The frontend has been restructured so both pages use a single component Room.jsx to manage the 3D scene.
- When the component is passed isEditable = true, controls are enabled to modify the room and change the state of decorations the user owns. After saving to the backend, upon refresh or navigation to home, the changes will persist.
- Items owned by the user are dynamically imported as seperate jsx asset components based on the modelID passed from the decoration object.
- The user's personalized room model now displays on the left side of the Edit Room page, beside their inventory
- Things like OrbitControls and React Three Fibers built in tools allowed us to implement intuitive controls for moving around items and rotation.
  - Left clicking on an object picks it up, and clicking a second time places it
  - A selected object can be rotated using the left and right arrow keys
  - Moving the cursor while an object is selected repositions it in the room
  - Users can add or remove an item from the room by clicking on the corresponding item card in their inventory

### Security Vulnerability Considerations
- We've added a number of features to ensure our application is secure.
- Registration:
  - There's a new /auth/register endpoint that is hit when a user registers for our app. The user submits an email and password that are sent to the backend API. The password is then hashed using bcrypt and a User object is created and stored in our Users MongoDB collection.
- Login:
  - There's a new /auth/login endpoint that is hit when a user attempts to login. The user's email/password are sent to the backend API. If a User object with the given email is found in our DB, it's hashed password is compared with the unhashed password given by the user. The login is only successful if the passwords match.
- A JWT (JSON web token) is generated based on the user's randomly generated user_id and our secret key. The JWT is returned by our register and login API (lasts 1 hour).
- Protecting Routes in the frontend (JWT):
  - In our frontend, all routes except the login/register page are protected by checking whether there's a valid JWT token stored in localstorage. If there isn't, or if the token is expired, the user will be redirected to the login page to acquire a new JWT token.
- Protecting Endpoints in the backend (JWT):
  - In our backend, all API endpoints except the auth ones require a JWT token to be passed in as a header. This token is then checked for validity before the request is allowed to proceed. This protects against unauthorized requests to our APIs.
- Server side input validation:
  - email: Emails are validated against a regex that checks that they match a valid email format.
  - password: Passwords are validated s.t. their length must be greater than 0. In the future, we can make this more secure by having additional requirements for any passwords (length, special chars, etc).
- Future improvements:
  - Require stronger passwords
  - Add a timeout feature if an incorrect password is entered too many times
  - The isTokenExpired check is stored in the frontend- so maybe it could be disabled by by a malicious person to get by with an invalid token. Even then, the backend API endpoints would be protected as that does its own validation, but there's room for improvement here.
  - As we add more API endpoints, we need to take care to prevent against SQL injection attacks for any endpoints accepting user inputs - especially the tasks page.

### Bug tracking
- As part of our development process during Milestone 3, we maintained an active bug tracking workflow using GitHub Issues
  - Initial Bug Reports: We created GitHub Issues based on bugs identified during the last crossplay session, which provided a solid foundation for our debugging efforts
  - Ongoing Tracking: Throughout this milestone, we logged the new bugs we encountered during development and testing
  - Resolution: We closed issues after the successful submission and merging of corresponding pull requests
- This process ensured we were consistently recording, classifying, and resolving bugs in a timely and organized manner, contributing to overall application stability and progress

## M2
### Home Page
- Implemented the timer as a Dialog popup accesible via the HUD. Implemented with states using Redux.
- Replaced placeholder Three.js room with a custom empty room.
- Layed out skeleton code format for loading in furniture models into room, with one desk and chair loaded in for now.
- Removed Stats button from HUD, as it is accesible via the Tasks page.
- Removed Navigation Bar menu button, and changed Color.

### Task Page
- Tasks are now pulled from the store and displayed in a list on the "My Tasks" page
- Tasks display a number of checkboxes or a progress bar representing the current progress made
- When the user clicks the "Add Task" button, the button and tasks beneath it are replaced by a form
- If user selects the "timed" type when creating a task, sets the values for hours and minutes, and then switches the type to "checkmark", the hours and minutes fields are set back to null. Applies in the opposite direction as well
- When the user clicks "Save", the task is added to the store
- Implemented form validation so that the user can't click "Save" if a required field is empty
- If the task is expanded and the "Delete" button is clicked, the task is removed from the store and the task is removed from the screen and a temporary notification appears informing them that their task was successfully deleted
- When a clicks a checkbox on their checkmark task, their progress is updated and stored
- When all checkboxes are ticked for a task:
  - The user is rewarded with coins
  - The task is removed from the list of tasks to complete
  - A temporary notification appears congratulating the user on completing their task
  - "Tasks Completed" in metrics is updated

### Marketplace Page
- Added Redux for the marketplace page so that users can select and purchase items.
- Added Redux to manage user state for coins and items - so the application can track how many coins the user has as well as which items they own.
- Added some unique furniture items to the marketplace instead of the placeholder items.
- Added the ability for users to purchase items from the marketplace page using their coins.

### Edit Room Page
- Added Redux for the edit room page so you can now view the items you purchased on this page

### Initialize Backend
- Added a backend server that has one "get" endpoint that sends mock stats data
- Added CreateAsyncThunk to the metrics slice to allow redux to call the api asynchronusly
- Stats component now calls the api to load in the metrics data and renders it dynamically
- Implemented Docker Compose to have both backend and frontend containers running together

## M1

### Home Page
- Added three.js scene with placeholder 3D room model
- Room is rotation and zoom enabled through OrbitControls from the drei import
- Basic lighting and camera settings have been set
- Displays a seperate component for HUD buttons for different features 
- UI styling done through tailwindCSS

### Task Page
- Created form for user to add a new task
  - Form changes depending on if it's a timed task or checkmark task
  - Form clears if "Cancel" is clicked
- Created a stats page on the right side of a book background image using Material UI components and mock redux data to view visual metrics about completed tasks.
- Used Material UI to style "My Tasks" and "My Stats" to fit on pages of a book image 
- Responsive to different screen sizes (landscape mode)

### Sign up & Login Page
- Created a sign up and login form for users to create and account and log in.
- User state is saved in local storage.
- If the user is logged in, sign up/login page redirect to the home page.
- If the user is not logged in, all other pages redirect to the login page.

### Marketplace Page
- Created a item display card on left side of page to show more details and interactions with an item from the marketplace
- Created a grid of item tiles on right side of page to allow users to view the different items from the marketplace.
- Used Material UI for styling and for responsiveness to different screen sizes.

## References
- The template for backend server logic was referenced from Alex's A2, linked here: https://github.students.cs.ubc.ca/CPSC455-2025S/students-alex602.
