const express = require('express');
uuid = require('uuid');
morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');


const app = express();
const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(morgan("common"));

app.use('/documentation', express.static('public/documentation.html'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

let topMovies = [
  {
    "id": 1,
    "title": "Bloodsport",
    "director": {
      "name": 'Newt Arnold',
      "birth": 1922,
      "bio": "Newt Arnold was an American film director, producer and screenwriter. Arnold directed Bloodsport, which was released in 1988 and has since become a cult film,[1] as well as several other screen works. Arnold was the two-time recipient of the Directors Guild of America Award for his work as an assistant director of The Godfather Part II and 12 Angry Men.",
    },
    "year": "1988",
    "genre": {
      "name": "Action",
    }
  },
  {
    "id": 2,
    "title": 'Lord Of the Rings',
    "director": {
      "name": 'Peter Jackson',
      "birth": 1961,
      "bio": "Sir Peter Robert Jackson ONZ KNZM (born 31 October 1961) is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy (2001–2003) and the Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien. Other notable films include the critically lauded drama Heavenly Creatures (1994), the horror comedy The Frighteners (1996), the epic monster remake film King Kong (2005), the World War I documentary film They Shall Not Grow Old (2018) and the documentary The Beatles: Get Back (2021). He is the third-highest-grossing film director of all-time, his films having made over $6.5 billion worldwide.",
    },
    "year": "2001",
    "genre": {
      "name": "Fantasy",
    }
  },
  {
    "id": 3,
    "title": 'Creed',
    "director": {
      "name": 'Ryan Coogler',
      "birth": 1986,
      "bio": "Ryan is an American director, producer and screenwriter. He is a recipient of four NAACP Image Awards, four Black Reel Awards and an Academy Award nomination for Best Picture. He made his feature-length debut with the independent film Fruitvale Station (2013), which won the Grand Jury Prize and the Audience Award for U.S. dramatic film at the 2013 Sundance Film Festival. It also won at the 2013 Cannes Film Festival, for Best First Film. He has since co-written and directed films such as the Rocky series spinoff, Creed (2015), and the Marvel film Black Panther (2018), the latter of which broke numerous box office records and became the highest-grossing film of all time by an African American director. Coogler also co-wrote and directed its sequel Black Panther: Wakanda Forever (2022).",
    },
    "year": "2015",
    "genre": {
      "name": "Action",
    }
  },
  {
    "id": 4,
    "title": 'Avengers: Infinity War',
    "director": {
      "name": 'Russo Brothers',
      "birth": 1971,
      "bio": "Russo Brothers are American directors, producers, and screenwriters. They direct most of their work together. They are best known for directing four films in the Marvel Cinematic Universe (MCU)",
    },
    "year": "2018",
    "genre": {
      "name": "Action",
    }
  },
  {
    "id": 5,
    "title": 'Black Panter',
    "director": {
      "name": 'Ryan Coogler',
      "birth": 1986,
      "bio": "Ryan is an American director, producer and screenwriter. He is a recipient of four NAACP Image Awards, four Black Reel Awards and an Academy Award nomination for Best Picture. He made his feature-length debut with the independent film Fruitvale Station (2013), which won the Grand Jury Prize and the Audience Award for U.S. dramatic film at the 2013 Sundance Film Festival. It also won at the 2013 Cannes Film Festival, for Best First Film. He has since co-written and directed films such as the Rocky series spinoff, Creed (2015), and the Marvel film Black Panther (2018), the latter of which broke numerous box office records and became the highest-grossing film of all time by an African American director. Coogler also co-wrote and directed its sequel Black Panther: Wakanda Forever (2022).",
    },
    "year": "2018",
    "genre": {
      "name": "Action",
    }
  },

];

let users = [
  {
    "id": 1,
    "name": "Matt",
    "favoriteMovies": []
  },
  {
    "id": 2,
    "name": "Chelsea",
    "favoriteMovies": ["The Notebook"]
  },
]

// get requests
app.get('/movies', (req, res) => {
  res.status(200).json(topMovies);
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/users/:name', (req, res) => {
  const { userName } = req.params;
  const user = users.find(user => user.name === userName).user;
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(400).send("No Such User");
  }
});

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = topMovies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie)
  } else {
    res.status(400).send("Missing Movie");
  }
});

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const directors = topMovies.find(movie => movie.director.name === directorName).director;
  if (directors) {
    res.status(200).json(directors)
  } else {
    res.status(400).send("No Such Director");
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = topMovies.find(movie => movie.genre.name === genreName).genre;
  if (genre) {
    res.status(200).json(genre)
  } else {
    res.status(400).send("No Such Genre");
  }
});

//put requests 
app.put('/movies/:id', (req, res) => {
  res.send("sucessful Put request!");
})

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No Id Found');
  }
});

//post requests
app.post('/movies', (req, res) => {
  res.send('Successful Post request');
});

app.post('/movies/:id/:title', (req, res) => {
  const { id, movieTitle } = req.params;
   let user = user.find( user => user.id == id );

   if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(user);
   } else {
    res.status(400).send("no user in the db.")
   }

})

app.post('/users', (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(200).json(newUser);
  } else {
    res.status(400).send('user needs names');
  }
});

//delete requests
app.delete('/movies/:id', (req, res) => {
  res.send('Successful Delete request');
});

app.delete('/users/:id', (req, res) => {
  res.send('the user has been removed sucessfully!')
})

app.delete('/movies/:id/:title', (req, res) => {
  res.send("sucessfully deleted title.")
})

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

