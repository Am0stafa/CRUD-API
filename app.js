const fs = require('fs')
const express = require('express')
const app = express()
const morgan = require('morgan')


//middelware to get access to the body as express doesn't parse json on the body by default
//app.use simple means that we will use want to add a middleware to our middleware stack.
app.use(express.json())

//this will applying to every single request we make
app.use((req, res, next)=>{
//to know exactly when the request happened.
    req.requestTime = new Date().toISOString();
    //it is really important to use next as we would never send back a request to the client and we wont be able to move on.
  next();
});

//third party middleware this middleware log to the concole information about the request made
app.use(morgan('dev'));






//this basically mean that we are listing of a get requist on this url the callback is usally called the route handeler
// app.get('/', (req, res) => {
    
//     res.status(200).json({message : 'hello from the backend', app:'Natour'})

// })

// app.post('/', (req, res) => {
//     res.status(200).send('you can post to this endpoint')

// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


const getAllTours =  (req, res) => {  
  //sending a json message with the status as a responce but if you didnt write .json it format it to json by defalut
  console.log(req.requestTime)
 res.status(200).json({ 
   status: 'success',
   requestAt: req.requestTime,
   result:tours.length,
   data:{
       tours: tours
   }
 })  
 
 
}

//when someone hits this route we want to simply send back all tours
app.get('/api/v1/tours',getAllTours);
//this can also be done like this
app.route('/api/v1/tours').get(getAllTours);
//also we can chain diffrent http methods
//app.route('/api/v1/tours').get(getAllTours).post(createPost) ....



//up we refactored the code to make it look cleaner by making the callback function in its own function.
// app.get('/api/v1/tours', (req, res) => {  
//   //sending a json message with the status as a responce
//  res.status(200).json({ 
//    status: 'success',
//    result:tours.length,
//    data:{
//        tours: tours
//    }
//  })  
 
 
// });





//this :id is called variables and are stored in req.params which will return an object containg the variable name and number
//we can use multiple variables like /:id/:x/:y and req.params will return all of them in an object 
//if you want a variable to be optional we use ? in the end of it like /:y?
app.get('/api/v1/tours/:id', (req, res) => {  
  //to convert it to a number && we can use req.params.id*1 to convert it
  const id = +req.params.id


 //this is another way of emplementing if(id>tours.length)
 //if(!tour)
  if(id>tours.length){
    return res.status(404).json({
      status: '404 Not Found',
      message: 'invalid id'
    })
  
  }
  
  const tour = tours.find(el=> el.id === id);
  
 res.status(200).json({ 
   status: 'success',
   
     data:{
         tour: tour
     }
 })  
 
 
});




//with a post request we can send data from the client to the server and this data is then ideally available on the request.
app.post('/api/v1/tours', (req, res)=>{
  //so again the request object is what hold all the data about the request that was done. and if the request contains 
  //some data that was send then that data shoud be on the request, but to accsess that data we use middelware
  
   const newId = tours[tours.length-1].id +1;
   const newTour = Object.assign({id: newId},req.body);
   tours.push(newTour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),err => {
    res.status(201).json({
        status:'success',
        data:{
          tour: newTour
        }
    })
   })
  
});


app.patch('/api/v1/tours/:id', (req, res)=>{
  //it is a lot of work to be done we need to get tour from the JSON file then change that tour and then save it again to the file.
  
  
  //to only emplement it when valid id is send
  if(req.params.id*1>tours.length){
    return res.status(404).json({
      status: '404 Not Found',
      message: 'invalid ID'
    })
  }
  
  res.status(200).json({
  
    status: 'success',
    data:{
      tour:"<updated tour here..>"
    }
  
  })
  
})


app.delete('/api/v1/tours/:id', (req, res)=>{

  //to only emplement it when valid id is send
  if(req.params.id*1>tours.length){
    return res.status(404).json({
      status: '404 Not Found',
      message: 'invalid ID'
    })
  }
  
//it is a lot of work to be done we need to get tour from the JSON file then change that tour and then save it again 
//to the file.  
  res.status(204).json({
  
    status: 'success',
    data:null
  
  })
  
})

//implementing the same idea of the above but in diffrent format.

const getAllUsers = (req, res) =>{
  res.status(500).json({
    status: 'error',
      message: 'This route is not yet defined!'
  })
}
const getUser = (req, res) =>{
  res.status(500).json({
    status: 'error',
      message: 'This route is not yet defined!'
  })
}
const updateUser = (req, res) =>{
  res.status(500).json({
    status: 'error',
      message: 'This route is not yet defined!'
  })
}
const deleteUser = (req, res) =>{
  res.status(500).json({
    status: 'error',
      message: 'This route is not yet defined!'
  })
}


app
  .route('/api/v1/users')
  .get(getUser)
  .post(getAllUsers)
  
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)




//3 way to make the above code.
//so how do we actually connect this new router well we will use it as middleware as this tourRouter is a real middleware so we can say
//const tourRouter = express.Router();
    //the below code is used in the app file and we import the routers from Router file to be used here
//app.use('/api/v1/tours', tourRouter) //this part is called mounting the routers and they must be below the tourRouter


//middleware to console log the the id number every time also we can use ths .param to check for valid id
                                   //val is used as it is a param middleware
//router.param('id',(req, res, next, val) =>{
//console.log(val)
//next();
//    })

// tourRouter
//   .route('/')
//   .get(getAllTours)
//   .post(getAllTours)

// tourRouter
//   .route('/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser)

//:nameRouter the above will go in this folder

//to run the express app
app.listen(8000 , () => {
    console.log('app running on port 8000')
});               
            
            
//so in the end we separeted every thing in its own file

//app.js: this is the global file

//server: this file is our entry point, it is for every thing NOT related to express we use things like app.listen but we dont know the app so we export it from the app.js file and import it in the server, this server file also contains some stuff that may not be related to express but related to our application so stuff like database configration or some error handling stuff or enviroment variable as they are out of the scope of express.

//:nameRouter: this file contain all the router like the ones done up with the http methods, so firstly we import express so that we will be able to use the express.router function as we will not use the app.router(...).get()... then implement the above method "marked" , then we will export the router function and then import it in the app.js file then mounting the routers as middlewares on the the diffrent routs like the one above "marked" app.use()

//controller: this file contains the router handlers which is inserted in the http methods like get(getuser) and export each and every on and then import them eather by destructuring or using its name.function name