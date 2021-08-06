# Software Design Document
<i>This design document follows [IEEE 1016-2009](https://standards.ieee.org/standard/1016-2009.html)</i></br>
<i>All UML diagrams are created with [Plant UML](https://plantuml.com/)</i><br>
<b>Issued:</b> <i>6th August 2021</i></br>
<b>Author:</b> <i>Harry Turner</i></br>

 - [Context](#context)
 - [Demo](#demo)
 - [User Stories](#user-stories)
 - [Data Model](#data-model)
 - [Logical Architecture](#logical-architecture)
 - [Image Upload Sequence](#image-upload-sequence)
 - [Design Decisions](#design-decisions)
 - [Front End](#front-end)
 - [Improvements](#improvements)

# Context
This document communicates a design for the Thea application which is an image processing and management application for camera trap data. It is a web accessible service that allows users involved in camera trap data analysis to upload their images, have them organised by the camera location they came from, have the images automatically analysed by an ML algorithm to detect species present in the image, and then browse the results of that analysis. The added value from this application is to save users time by automating the manual step of detecting animal species in camera trap images.

![Camera Trap](http://www.naturespy.org/wp-content/uploads/2014/05/cameratrap.jpg)
<i>Camera Trap - [Nature Spy](https://www.naturespy.org/2013/11/joy-camera-trapping/)</i>

# Demo
See demo on [front page](https://github.com/HarryTurner93/thea).

# User Stories

<i>Because I'm not actively engaging with users whilst building this, these will stay fixed, so I'm putting them here. In reality these would live in Zenhub and evolve constantly.</i>

 - As a user...
 - I want a secure user account so that other people can't see my data.
 - I want my cameras displayed on a map so they fit my mental model of organisation.
 - I want to upload images directly from my browser because it's easy and I'm familiar with it.
 - I want to store my images against the camera trap that they came from so I can manage them easily.
 - I want the system to predict which species are in my images so that I don't have to.
 - I want the system to store my images so that I can access them easily later on.
 - I want to easily browse the images stored in my camera trap so I can access them easily later on.

# Data Model
This viewpoint addresses the data types used within the system. It's modelled with a UML class diagram.

![Data Model](http://www.plantuml.com/plantuml/png/ROzD2i8m48NtSugXIw758nHSUG3NPMgc9P0VIMT0aTxTcAfHS1NU-puUatuHIgBU0GUnSiFJmWdlWAXg3MfEWpMmll61F2UgmhdahEHYSf447MLH3TSYXhaqTUNeQUOwOf_nUsEAr-6IuaYZTTd_z2aQ3l8NZJQP7x02bB-qBJRxhjir-3eUjgU2xHpeEHZrxW40)

#### Notes
 - I hardcoded the fields for the animal probabilities for each image instance. See the rationale for this in the Design Decisions section.

# Logical Architecture
This viewpoint addresses the main components in the system. It's modelled with a UML class diagram. The logical architecture is a fairly simple server/client architecture. The backend handles the database and hands off time consuming processing tasks to a celery worker that processes out of the request/response loop. Objects are stored in S3 which the client accesses directly. 
![Component Diagram](http://www.plantuml.com/plantuml/png/NP31gi8m44NtynNPFxfwErU5TbbG6yJrj1r2QqmaCnNzUmTBetLr9vTpu9AI1PFCLm-ncwWNK_cHWi0IPcTQGct_D8Vv0IjrfeuftIb1lfIj9mmkAboHf_HSh96pLQDWXqom7keS8ejBP8zDnlRli18JEeBDImNxRvhOepTMiBy0h5EBuclLf_lLRubuT846SseRXgmec_Tjs-sSaiAWt_K2)

#### Rationale
 - Django was chosen for the webserver because the data model can be represented simply using Django Rest Framework and PostgreSQL. 
 - Because this design is not intended for deployment into a cloud environment it doesn't include typical web infrastructure such as proxy servers or loadbalancers. 
 - S3 Object Storage was chosen for storing images, however rather than use the real AWS S3, this implementation uses AWS Local Stack to simulate S3 locally. 
 - React and Redux were chosen as industry standard powerful UI frameworks for frontend applications. There is good support for map based views.
 - Celery was chosen for handling computation heavy tasks that can be taken out of the HTTP Request/Response cycle and offloaded onto worker nodes. These workers will carry out image processing tasks and stick the results into the database, they don't need to respond to the client making this is a natural architectural choice. This saves on the complexity of having the front end poll for results.
 - Redis is a reasonable choice of message queue that is opensource and plays nicely with Celery.

# Image Upload Sequence 
This viewpoint explains how the components interact when a user uploads an image. It is modelled with a UML Sequence Diagram.
![Sequence Diagram](http://www.plantuml.com/plantuml/png/TP6nReGm38RtF8N7ThWNO3YTrEuTEdH41YmklP2WsBJYxMifa3JeM4w--CldF-R6Wb6MoHdi9KHuSvQy0F9McLdRjhSpwkaNTKpnXwBsovyQ2V6H-gao0mfso0GVtJVrygb3S2G5weF2lUy5SgwDCLkmoxKCRc0aQUT8R4TFGxj4z_9gIiYBmkbQ0nNrprQdK6wHravQggbgLJQLpS4pdSJAabPxLjOwrJK_gm5MEHtPlLrRyz3QbTRS07fqAs-kqpLaHxhsT07EPKccpiTaulWe7RKuuVezsPE3k11c-BrRjw_1Skk3w7KSLWDm-jqJNQP00GvqVwV-iPD9VEJBXZRCa1_CJN-MoVq1)

#### Notes
 - For reasons explained in the section on Extensions, I do not implement presigned URLs because localstack doesn't support them. 
 - When the image is first registered with the backend, it defaults values of -1 to all the animal probabilities. When the front end requests the image, the backend checks to see if any of the probabilities are -1, if they are it marks the image as not_ready and the front end displays a loading symbol. At the same time that the image is first registered, the backend puts it in a queue for processing. When the worker gets around to processing the image, it updates the database. The client meanwhile continues to poll the backend every second whilst it still has images marked as not_ready.

# Design Decisions

#### Map behind everything. 
I load and display the map behind everything including the login screen where it just blurs it and absorbs clicks. Upon login, the map becomes visible and everything is rendered on top. I did it this way because I thought the effect looked cool, it was achived by rendering the map on a div at one layer, and then having a div overlay on top using appropriate CSS settings to manage absolute positioning and to let clicks through. All components are rendered as children and passed into the map component.

#### Hard Coded Classes
There are three classes in the system: Fox, Rodent, & Bird. These are stored as attributes of an Image object as three floats, which are ultimately stored in the PostGRES database. This is a very static and hardcoded approach, and probably not how I'd implement the system for real. The reason I adopted this approach is because it allowed me to take advantage of Django Rest Framework's filtering backend that lets me filter by the model fields easily. This makes the API call very nice as the client simply requests `?ordering=fox` to order by foxes, and Django handles the rest. It's fast too.

#### Authentication
Users authenticate with a username and password by attempting to obtain a token. If the username and password are correct and associated with a user, and a token exists, it is returned to the client to allow them to authenticate with the token in the future. This is handled with Django Token Authentication and offers a reasonable out of the box auth solution.

#### Authorisation
When attempting to access the `camera` or `image` resources, the user must first be authenticated, this is done with Django IsAuthenticated permissions. Upon fetching a camera or list of cameras, the queryset filters by cameras where the associated user is the same as the requesting user. This works because a camera can only have one user. For images the logic is similar, except the camera ID must be provided as part of the requst, and only the images belonging to that camera are returned. In order to make sure the user is authenticated, it first checks that the requested camera ID belongs to the user.

#### Image Count
In order for the PopUp (see Frontend Components below) to display the number of images in the popUp without doing any heavy lifting, the Camera Serializer in Django computes the count of the number of images associated with the camera object and returns it as an extra field which is accessible by the Frontend.

#### Waiting Indicator
Due to the asynchronous nature of the image upload and the time taken to process the images, it is possible (even likely) that the user will browse the images before their results have been computed. To indicate that results are still being computed, a little loading symbol is displayed against any images not yet complete. In order for the front end to know when to display this loading symbol, I compute an extra field called `waiting` inside the ImageSerializer which checks to see if all the Fox, Rodent, and Bird fields are -1, because if they are then the image has not been processed. This field is returned as part of the serialized image response.

# Front End

#### Mocks
I created these mockups as a guide to building the UI, the details are slightly different as I used the Evergreen UI component library. There are also other screens such as dialogs that aren't included here. I mocked these up as a rough idea of what I wanted to do, then filled in the gaps whilst coding the front end. A small project like this didn't require complete and accurate mockups up front, but just enough so I knew what features I'd need to build.

![Camera Dialog](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/mock_1.png)
![Browser](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/mock_2.png)

#### Map
The map component is responsible for showing a browseable map and displaying the cameras in the right locations as icons. It also manages the cameras by handling the add/delete logic, including the necessary calls to the server. I designed it this way because I felt the cameras were inseparable to the map, it also made it easier because of the way icons are handled in mapbox. Speaking of which, I use mapbox to actually display the map.<br>

I designed it as a component that wraps other components, that is, it accepts a 'children' prop which it then renders appropriately. This made it fairly easy to overlay components onto the map without having to worry about the CSS styles on the children component. This was achieved by the map component having two layers, the map layer and then an overlay layer with appropriate CSS styles. All children are rendered on this layer, and appear on top of the map.<br>

The map is not connected to any global state, it exposes two functions as externally callable functions. The way I achieved this was to make the map a reference value in the parent App, which can then use the reference to call the functions. I don't know whether this is good or bad practice, but it allowed me to expose two methods to the rest of the application to allow it manipulate the map and the cameras. The two methods are addCamera and deleteCamera respectively. deleteCamera makes the necessary call to the server and removes the camera from the internal state. addCamera triggers the next state in a state machine, described next.

Adding a camera requires moving through several steps, which I manage with a state machine. The first state is normal operation, where the map is navigable and cameras can be clicked on. The addCamera function triggers a move to the next state which waits for the user to click on the map, this transitions to a state that displays a dialog asking for a name, upon confirmation the map transitions to the final state which creates the camera by calling the server and adding the resulting camera to the internal state. The state automatically transitions back to the viewing state when completed.

![Map State Machine](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/camera_state_machine.png)

Finally, the map takes a prop called onCameraClick, and adds this to each camera displayed on the map as a callback that is called whenever that camera is clicked, passing it's ID as an argument. This is how the map component calls out to the rest of the application upon user interaction.

#### PopUp
The PopUp component is an information pane rendered on top of the map that has a piece of state identifying the camera_id. It's purpose is to display information about a camera, and handle file uploads to a camera. 

The external interface to the rest of the system is two fold. First, two callbacks pass in via props, one that is called when the Delete Camera button is pressed, and it handles calling the Map to delete the requested camera. The other is the Open Browser button which handles opening the browser. The PopUp is triggered by a change in it's camera ID state, which any part of the system can update by pushing a new ID to it. Upon any change in the camera ID state, the PopUp polls the backend for the information on that camera and updates the UI.

Finally the upload files feature lets a user select multiple files from their machine and then uploads these to the system by generating a random name, uploading the renamed file to S3, and then registering that file with the system by POSTing a new image.

![Map](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/map.png)

#### Browser
The browser component is similar to the PopUp in that it's permanently rendered on top of the map, but only visible when it's open state is true, which is triggered by clicking the Open Browser button on the PopUp. This also updates the camera ID state of the browser which then pulls in a page of images from the backend to display.

The browser displays two components that control the images, the first is the pagination which is is simply a page number, the other is a set of three buttons, Rodent, Fox, and Bird. Selecting either of those will request the backend to sort by the highest score for that animal and return the images in that order, the page number determines the pagination. This is a simple design that works seamlessly with the filtering and pagination supported by Django.

![Browser](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/browser.png)

#### Login
The login component is a basic username and password text box with a Submit button. It is rendered on top of the map and absorbs all clicks, the Map doesn't poll for data until the user is logged in. I did this because it made a really nice effect where the map was visible behind the login, and then became visible upon login.

Upon submit, the components attempts to login on the backend by receiving a token, this is either successful or not depending on whether the credentials were correct. If they were, the token is stashed into global state and this triggers the rest of the app to start working, otherwise it fails and alerts the user.

![Login](https://github.com/HarryTurner93/project_thea_revamped/blob/main/artifacts/login.png)

# Improvements

#### Security
Most improvements are around security, partly because implementing them at the time was taking too much effort to get working and wasn't what I wanted to focus on in this project, so I deliberately skipped some best security practices and instead highlight them here.

**Public Image URLs** All images are accessible on the public S3 endpoint, whereas in reality I would generate presigned URLs. I did this because making presigned URLs work with localstack is a) complicated, and b) not the same as S3! It's actually much easier to generate presigned URLs when using the real S3 and I didn't want to waste time making it work for the development stack. To implement this, the FE would need to make another call to the BE to get the presigned URLs or have them returned in the image objects themselves.

**File Name Generation** The client generates filenames, puts them in S3 and then tells the backend about them. This means the BE has less control. Ideally, I'd introduce another call to the backend to request the ability to upload an image. The BE would then generate the name, and also the presigned POST URL, and the client would use that instead.

**Input Validation** There is no input validation anywhere in the system, which is lazy of me, but would also complicate things for this demo project. Specifically, the frontend happily uploads whatever files it wants to the backend (granted these aren't executed anywhere, but still..) It also lets the user enter names for cameras which are then sent straight to the server with no validation etc. Not best practice.

**No CORS Checks** CORS checks are turned off for S3, because the localstack doesn't seem to work properly with them. For real S3 this shouldn't be an issue.

#### Invalid

**Images per Page Fixed** There are six images displayed in the browser, and this number is actually fixed in multiple places. It's defined in the pagination settings in the BE which always returns 6, and it's used to compute the number pages from the returned count. Not ideal but it works.

#### Aesthetic

**Images Get Squashed** What is says really, it just packs 6 images into a grid on the screen with a fixed size to make the UI work. There's no attempt to handle varying image size. I skipped this because it's an uninteresting detail.
