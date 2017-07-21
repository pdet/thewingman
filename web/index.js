var fs = require('fs');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var readData = function(req,res,next){
  console.log("readData");
  var data = []
  fs.readdir('public/data/', function(err, dir) {
      for (var i=0; i<dir.length; i++) {
        if(dir[i] !== ".DS_Store" && dir[i] !== "dislike" && dir[i] !== "like"){

          var path_info = __dirname + "/public/data/"+dir[i]+"/info.json"
          var info = require(path_info);

          var path_photo = __dirname + '/public/data/'+dir[i]+'/'
          var photos = fs.readdirSync(path_photo)
          photos.splice(photos.indexOf("info.json"), 1);

          var object = { "id":dir[i] , "info": info, "photos": photos}
          data.push(object)
        }
      }
      req.data = data
      next()
  });
}



app.get('/', readData, function(request, response) {
  console.log("request ", request.data)

  var data = []
  data["files"] = request.data
  response.render('pages/index', data);
});

app.get('/like/:id', function(request, response) {
  console.log("request ", request.params)
  var id = request.params.id

  var old_path = __dirname + '/public/data/'+id+'/'
  var new_path = __dirname + '/public/data/like/'+id+'/'
  fs.renameSync(old_path,new_path)
  response.send("liked")
});

app.get('/dislike/:id', function(request, response) {
  console.log("request ", request.params)
  var id = request.params.id

  var old_path = __dirname + '/public/data/'+id+'/'
  var new_path = __dirname + '/public/data/dislike/'+id+'/'
  fs.renameSync(old_path,new_path)
  response.send("dislike")
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
