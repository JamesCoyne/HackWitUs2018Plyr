import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import querystring from 'query-string';
import { render } from 'react-dom'
import { ResponsiveRadar } from '@nivo/radar'

class App extends Component {

  constructor(){
    super();
    this.state = {
      data: ''
    };
  }

  componentDidMount(){
    let accessToken = querystring.parse(window.location.search).access_token;
    if(accessToken == null){
      console.log('access token is null');
      window.location.replace("https://james-spotify-api-fun-zone.herokuapp.com/login");
    }

    //fetch top tracks
    fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
    .then(response => response.json())
    .then (data => {
      let tracks = [];
      for(var x in data.items){
        tracks[data.items[x].id] = {
          name: data.items[x].name,
          album: data.items[x].album.name,
          artist: data.items[x].album.artists[0].name,
          explicit: data.items[x].explicit
        }
      }

      //fetch reccently played tracks
      fetch('https://api.spotify.com/v1/me/player/recently-played', {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + accessToken}
      })
      .then(response => response.json())
      .then(
        data => {
          for(var x in data.items){
            tracks[data.items[x].track.id] = {
              name: data.items[x].track.name,
              album: data.items[x].track.album.name,
              artist: data.items[x].track.album.artists[0].name,
              explicit: data.items[x].track.explicit
            }
          }

          //parse ids of all tracks
          let keys = Object.keys(tracks);
           let idString = ''
           for(var x in keys){
             idString += keys[x] + ',';
           }

          //fetch audio features for all tracks
          fetch(
            'https://api.spotify.com/v1/audio-features/?ids=' + idString,
            {
              method: 'GET',
              headers: {'Authorization' : 'Bearer ' + accessToken}
            }
          )
          .then(response => response.json())
          .then(
            data => {

              //find the average of each audio feature. If anyone knows a better way to do this please let me know.
              for(var x in data.audio_features){
                tracks[data.audio_features[x].id].acousticness = data.audio_features[x].acousticness;
                tracks[data.audio_features[x].id].danceability = data.audio_features[x].danceability;
                tracks[data.audio_features[x].id].energy = data.audio_features[x].energy;
                tracks[data.audio_features[x].id].instrumentalness = data.audio_features[x].instrumentalness;
                tracks[data.audio_features[x].id].liveness = data.audio_features[x].liveness;
                tracks[data.audio_features[x].id].loudness = data.audio_features[x].loudness;
                tracks[data.audio_features[x].id].speechiness = data.audio_features[x].speechiness;
                tracks[data.audio_features[x].id].tempo = data.audio_features[x].tempo;
              }

              let avgValues = {
                length: 1,
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                loudness: 0,
                speechiness: 0,
                tempo: 0,
                explicit: 0
              }
              for(var x in tracks){
                avgValues.acousticness += tracks[x].acousticness;
                avgValues.danceability += tracks[x].danceability;
                avgValues.energy += tracks[x].energy;
                avgValues.instrumentalness += tracks[x].instrumentalness;
                avgValues.liveness += tracks[x].liveness;
                avgValues.loudness += tracks[x].loudness;
                avgValues.speechiness += tracks[x].speechiness;
                avgValues.tempo += tracks[x].tempo;
                if(tracks[x].explicit) avgValues.explicit++;
                avgValues.length++;
              }
              avgValues.acousticness /= avgValues.length;
              avgValues.danceability /= avgValues.length;
              avgValues.energy /= avgValues.length;
              avgValues.instrumentalness /= avgValues.length;
              avgValues.liveness /= avgValues.length;
              avgValues.loudness /= avgValues.length;
              avgValues.speechiness /= avgValues.length;
              avgValues.tempo /= avgValues.length;
              avgValues.explicit /= avgValues.length;

              this.setState({data: avgValues});
            }
          )
        }
      )
    })
  }

  render() {
    return (
      <div>
        <div>
          <h3> Average tempo: {Math.round(this.state.data.tempo)} BPM</h3>
        </div>
        <div style={{height: window.innerHeight-200}}>
        <ResponsiveRadar
        data={[
          {
            "taste": "acousticness",
            "": Math.round(this.state.data.acousticness*100)
          },
          {
            "taste": "danceability",
            "": Math.round(this.state.data.danceability * 100)
          },
          {
            "taste": "energy",
            "": Math.round(this.state.data.energy * 100)
          },
          {
            "taste": "instrumentalness",
            "": Math.round(this.state.data.instrumentalness * 100)
          },
          {
            "taste": "liveness",
            "": Math.round(this.state.data.liveness* 100)
          },
          {
            "taste": "speechiness",
            "": Math.round(this.state.data.speechiness * 100)
          },
          {
            "taste": "explicit percentage",
            "": Math.round(this.state.data.explicit*100)
          }
      ]}
        keys={[""]}
        indexBy="taste"
        maxValue={100}
        margin={{
            "top": 0,
            "right": 70,
            "bottom": 40,
            "left": 100
        }}
        curve="linearClosed"
        borderWidth={2}
        borderColor="inherit"
        gridLevels={10}
        gridShape="linear"
        gridLabelOffset={36}
        enableDots={false}
        dotSize={2}
        dotColor="inherit"
        dotBorderWidth={3}
        dotBorderColor="#000000"
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors="nivo"
        colorBy="key"
        fillOpacity={0.05}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
        legends={[
            {
                "anchor": "top-right",
                "direction": "column",
                "translateX": 0,
                "translateY": 0,
                "itemWidth": 0,
                "itemHeight": 0,
                "symbolSize": 0,
                "symbolShape": "circle"
            }
        ]}
    />
      </div>
    </div>
    )
  }
}
export default App;
