$(document).ready(function () {
    let actorId1 = "16828";
    let actorId2 = "74568";
    
    GetActorDetails(`https://api.themoviedb.org/3/person/${actorId1}?api_key=08f123202c02b3f6e43980f02514a11d&language=en-US`, '.actor1')
    GetActorDetails(`https://api.themoviedb.org/3/person/${actorId2}?api_key=08f123202c02b3f6e43980f02514a11d&language=en-US`, '.actor2')
    
  });
  
  function GetActorDetails(url, containerId) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `${url}`,
      "method": "GET",
      "headers": {},
      "data": "{}"
    }
  
    $.ajax(settings).done(function (response) {
      ShowActorDetails(response, containerId);
    });
  }
  
  function ShowActorDetails(results, containerId) {
    console.log("Actor Details Page", results, containerId)
    let popularity =results.popularity.toFixed(2);
    let age = getAge(results.birthday);
    let poster = document.createElement('div');
    poster.innerHTML = `<div style=" margin-top:150px; max-width:600px; height: 500px; width:100%; background-repeat:no-repeat; background-size:contain; background-image: url('https://image.tmdb.org/t/p/w500/${(results.profile_path)}')"></div>  
    <div style="text-align:left; padding: 30px; margin:0px auto; background-color:white; max-width:800px;"><div style="">
      <h1 class="primary-header">${results.name}</h1><a class="primary-btn" href="https://www.imdb.com/name/${results.imdb_id}/">IMDB</a>
        <div style=" width:100%; font-weight:bold; text-align:left; padding-top:30px;">
    
      <p>Birthday: ${results.birthday}</p> 
      <p>Age: ${age}</p>  
      <p>Popularity: ${popularity}</p>     
      <p> Birth Place: ${results.place_of_birth}</p>
     
      </div>
      </div>
    </div>`
  
    // <p style=" text-align:left;">${results.biography}</p>
    $(poster).addClass('poster');
    let g = new Gauge({
      size: 200
    });
    g.update(`${popularity}`);
    $(poster).append(g);
    $(containerId).append(poster);
  }
  
  function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
  
    return age;
  }
  
  let Gauge = function(configuration) {
    let that = {}
  
    let config = {
      size: 300,
      arcInset: 150,
      arcWidth: 60,
  
      pointerWidth: 8,
      pointerOffset: 0,
      pointerHeadLengthPercent: 0.9,
  
      minValue: 0,
      maxValue: 100,
  
      minAngle: -90,
      maxAngle: 90,
  
      transitionMs: 750,
  
      currentLabelFontSize: 20,
      currentLabelInset: 20,
  //    labelFont: "Helvetica",
      labelFontSize: 15,
      labelFormat: (numberToFormat) => {
        let prefix = d3.formatPrefix(numberToFormat)
        console.log(prefix)
        return prefix.scale(numberToFormat) + '' + prefix.symbol.toUpperCase()
      },
  
      arcColorFn: function(value) {
        let ticks = [{
          tick: 0,
          color: 'red'
        }, {
          tick: 5,
          color: 'orange'
        }, {
          tick: 10,
          color: 'yellow'
        }, {
          tick: 15,
          color: 'green'
        }]
        let ret;
        ticks.forEach(function(tick) {
  
          if (value > tick.tick) {
            ret = tick.color
            return
          }
        });
        return ret;
      }
    }
  
    function configure(configuration) {
      for (let prop in configuration) {
        config[prop] = configuration[prop]
      }
    }
    configure(configuration);
  
    let foreground, arc, svg, current;
    let cur_color;
    let new_color, hold;
  
    var oR = config.size - config.arcInset;
    var iR = config.size - oR - config.arcWidth;
  
    function deg2rad(deg) {
      return deg * Math.PI / 180
    }
  
    function render(value) {
  
      //oR = 30;
      //iR = 10;
  
  
  
      // Arc Defaults
      arc = d3.svg.arc()
        .innerRadius(iR)
        .outerRadius(oR)
        .startAngle(deg2rad(-90))
  
      // Place svg element
      svg = d3.select("body").append("svg")
        .attr("width", config.size)
        .attr("height", config.size)
        .append("g")
        .attr("transform", "translate(" + config.size / 2 + "," + config.size / 2 + ")")
  
  
      // Append background arc to svg
      var background = svg.append("path")
        .datum({
          endAngle: deg2rad(90)
        })
        .attr("class", "gaugeBackground")
        .attr("d", arc)
  
      // Append foreground arc to svg
      foreground = svg.append("path")
        .datum({
          endAngle: deg2rad(-90)
        })
        //.style("fill", cur_color)
        .attr("d", arc);
  
      // Display Max value
      var max = svg.append("text")
        .attr("transform", "translate(" + (iR + ((oR - iR) / 2)) + ",15)") // Set between inner and outer Radius
        .attr("text-anchor", "middle")
        .style("font-family", config.labelFont)
        .text(config.labelFormat(config.maxValue))
  
      // Display Min value
      var min = svg.append("text")
        .attr("transform", "translate(" + -(iR + ((oR - iR) / 2)) + ",15)") // Set between inner and outer Radius
        .attr("text-anchor", "middle")
        .style("font-size", config.labelFontSize)
        .style("font-family", config.labelFont)
        .text(config.minValue)
  
      // Display Current value  
      current = svg.append("text")
        .attr("transform", "translate(0," + -(-config.currentLabelInset + iR / 4) + ")") // Push up from center 1/4 of innerRadius
        .attr("text-anchor", "middle")
        .style("font-size", config.currentLabelFontSize)
        .style("font-family", config.labelFont)
        .text(config.labelFormat(current))
    }
  
    function update(value) {
      // Get new color
      new_color = config.arcColorFn(value)
      console.log(new_color)
  
      var numPi = deg2rad(Math.floor(value * 180 / config.maxValue - 90));
  
      // Display Current value
      current.transition()
        .text(value)
        // .text(config.labelFormat(value))
  
      // Arc Transition
      foreground.transition()
        .duration(config.transitionMs)
        .styleTween("fill", function() {
          return d3.interpolate(new_color, cur_color);
        })
        .call(arcTween, numPi);
  
      // Set colors for next transition
      hold = cur_color;
      cur_color = new_color;
      new_color = hold;
    }
  
    // Update animation
    function arcTween(transition, newAngle) {
      transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });
    }
  
    render();
    that.update = update;
    that.configuration = config;
    return that;
  }
  