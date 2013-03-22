//
// Copyright 2013, Adam Briggs
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

function ProgressBar() {

  // default configuration settings
  // these may be modified by the caller after object creation and before calling Init()
  this.config = { canvasName: "ProgressBar", // the name of the canvas to use
                 background: "progress_back.png", // the background image
                 mercury: "progress_blast.png", // the image of the progress bar
                 meniscus: "progress_rocket.png", // the image of the moving end of the progress bar
                 minVal: 0, // the minimum value to display
                 maxVal: 30000, // the maximum value to display
                 minOffset: 99, // the offset of the minimum value within the image
                 maxOffset: 950, // the offset of the maximum value within the image
                 animationInterval: 75, // the animation interval in milliseconds
                 pauseCount: 60, // the number of animationIntervals to pause before and after animating
                 animateCount: 50 } ; // the number of animationIntervals to fill the progress bar

  var progressCanvas = null ;
  var progressSize = { width: 0, height: 0 } ;
  var progressContext = null ;

  var backgroundImage = null ;
  var mercuryImage = null ;
  var meniscusImage = null ;

  var animation = { current: 0,
                    max: 0,
                    step: 0,
                    pauseCount: 0,
                    pauseFor: 0 } ;

  // call Init() after creating a ProgressBar object and modifying any config variables
  this.Init = function() {
    backgroundImage = new Image ;
    mercuryImage = new Image ;
    meniscusImage = new Image ;

    backgroundImage.src = this.config.background ;
    mercuryImage.src = this.config.mercury ;
    meniscusImage.src = this.config.meniscus ;  

    progressCanvas = document.getElementById(this.config.canvasName) ;
    progressSize.width = progressCanvas.clientWidth ;
    progressSize.height = progressCanvas.clientHeight ;
    progressContext = progressCanvas.getContext("2d") ;
  } // function Init

  // Draw the progress bar with progress set to the given val (on a scale of config.minVal to config.maxVal)
  this.Draw = function(val) {
    var boundedVal = val ;
    var valRange = this.config.maxVal - this.config.minVal ;
    var offsetRange = this.config.maxOffset - this.config.minOffset ;
    var valPercent = 0 ;
    var levelOffset = 0 ;

    progressContext.drawImage(backgroundImage, 0, 0,
        progressSize.width, progressSize.height) ;

    if (val < this.config.minVal)
      boundedVal = this.config.minVal ;

    if (val > this.config.maxVal)
      boundedVal = this.config.maxVal ;

    valPercent = boundedVal / valRange ;
    levelOffset = Math.floor(valPercent * offsetRange) ;
   
    progressContext.save() ;
    progressContext.beginPath() ;
    progressContext.rect(0, progressSize.height - levelOffset,
        progressSize.width, progressSize.height) ;
    progressContext.clip() ;

    progressContext.drawImage(mercuryImage, 0, 0,
        progressSize.width, progressSize.height) ;

    progressContext.restore() ;

    progressContext.drawImage(meniscusImage, 0, progressSize.height - levelOffset - meniscusImage.height,
        progressSize.width, meniscusImage.height) ;
  } // function Draw

  // animation_timer is called at config.animationInterval after Animate() has been called
  this.animation_timer = function() {
    this.Draw(animation.current) ;

    if (animation.current == animation.max) {
      animation.pauseCount++ ;
      if (animation.pauseCount >= animation.pauseFor) {
        animation.current = 0 ;
        animation.pauseCount = 0 ;
        return ;
      }
    }

    animation.current += animation.step ;
    if (animation.current > animation.max)
      animation.current = animation.max ;
  } // function animation_timer

  // Animate the progress bar filling up to the given val (on a scale of config.minVal to config.maxVal)
  this.Animate = function(val) {
    var myself = this ;

    animation.current = 0 ;
    animation.max = val ;
    animation.step = Math.floor(val / this.config.animateCount) ;
    animation.pauseFor = this.config.pauseCount ;
    animation.pauseCount = 0 ;

    window.setInterval(function() { myself.animation_timer(); }, this.config.animationInterval) ;
  } // function Animate

} // function ProgressBar
