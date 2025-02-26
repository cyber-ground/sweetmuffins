'use strict';

import {console_color,console_red,console_orange,console_yellow,console_green,
  console_blue,console_purple,console_magenta,console_cyan} from './logColor.js';
import { matchedGirls } from './data.js';

// ---------------------------------------------------------------------------------
//*                           --- SWEET MUFFINS ---
// ---------------------------------------------------------------------------------

//	['.9','.8','.7','.6','.5','.4','.3','.2','.1']
    ['e6','cc','b3','99','80','66','4d','33','1a']

const mobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
let portrait = window.matchMedia('(orientation: portrait)').matches;
const redHeart = document.querySelector('.red-heart');
const heartGrid = document.querySelector('.heart-grid');
const splashScreen = document.querySelector('.splash-screen');
const btnEnter = splashScreen.querySelector('.btnEnter');
const figure = splashScreen.querySelector('.figure');
const title = document.querySelector('.title');
const warn = document.querySelector('.warn');
const video = document.querySelector('.video');
  video.addEventListener('touchstart', e => e.preventDefault());
  const starWrapper = document.querySelector('.star-wrapper');
    const whiteStars = document.querySelectorAll('.white-star');
    let targetStar = whiteStars[Math.floor(Math.random() * whiteStars.length)];
    const msg = document.querySelector('.msg');
  const muffin = document.querySelector('.muffin');
const image = document.querySelector('.image');
const chars = ['k','g','m','t','e','u','v'];
const unMatchedGirlsLength = 22;
let [index, retry] = [0,0];
let [starActive, activateHeart, entered] = [false, true, false];
let [touch, startGame, changeMood] = [false, false, false];
let defaultHeight, menubar, storeData, tid_pulse;
let lastRedHeartPosX, lastRedHeartPosY;
// redStar(); //* targetS/tar Finder ---

var enterHowl = new Howl({src: ['mp3/enter.mp3'], volume: 0.3});
var retryHowl = new Howl({src: ['mp3/retry.mp3'], loop:true, volume: 0.05});
var timelineHowl = new Howl({src: ['mp3/timeline.mp3'], volume: 0.2});
var matchedStarHowl = new Howl({src: ['mp3/matchedStar.mp3'], volume: 0.2});
var unmatchedStarHowl = new Howl({src: ['mp3/unmatchedStar.mp3'], volume: 0.1});
var matchedHowl = new Howl({src: ['mp3/matched.mp3'], volume: 0.05}); 
var unmatchedHowl = new Howl({src: ['mp3/unmatched.mp3'], volume: 0.07});
var unmatchedTwoHowl = new Howl({src: ['mp3/unmatchedTwo.mp3'], volume: 0.03});
var phoneHowl = new Howl({src: ['mp3/phone.mp3'], loop:true, volume: 0.1}); 

function init() { 
  if(portrait) { defaultHeight = innerHeight}
  else { defaultHeight = innerWidth}
  figure.style.opacity = 1;
  //* mouseMove heart ---
  redHeartVisibility('visible');
  sessionStorage.removeItem('retried');
} init();

btnEnter.addEventListener('click', () => {
  if(!entered) {
    entered = true;
    enterHowl.play();
    clearTimeout(tid_pulse);
    btnEnter.classList.remove('pulse');
    btnEnter.classList.add('active');
    setTimeout(() => {title.classList.add('inactive')}, 0);
    setTimeout(() => {title.classList.remove('inactive')}, 500);
    if(!sessionStorage.hasOwnProperty('retried')) { 
      setTimeout(() => { timeline()}, 1000);
    } else {
      retryHowl.stop();
      deleteHeart();
      splashScreen.classList.add('inactive');
      document.body.classList.add('activate');
    }
  }
});

function timeline() {
  heartSplash('#f00');
  warn.classList.add('inactive');
  setTimeout(() => { storeData = warn.innerHTML;
    warn.textContent = 'R18+'; warn.style.opacity = .7;
  }, 800);
  setTimeout(() => { let fadeId = timelineHowl.play();
    timelineHowl.fade(0.2, 0, 7500, fadeId); 
  }, 1000);
  setTimeout(() => {figure.textContent = chars[1]}, 500);
  setTimeout(() => {figure.textContent = chars[2]; heartAppear()}, 2500);
  setTimeout(() => { title.classList.add('inactive')}, 3500);
  setTimeout(() => { figure.textContent = chars[3]}, 4000);
  setTimeout(() => { heartSplash('#f00'); figure.textContent = chars[4]}, 5000);
  setTimeout(() => { deleteSign(); figure.textContent = chars[5]}, 6000);
  setTimeout(() => { title.classList.remove('inactive')}, 6800);
  setTimeout(() => { figure.textContent = chars[6]}, 7000);
  setTimeout(() => { startGame = true;
    splashScreen.classList.add('inactive');
    document.body.classList.add('activate');
  }, 8000);
}

whiteStars.forEach(star => {
  star.addEventListener('click', function () {
    if(starActive) return;
      starActive = true;
      activateHeart = false;
      redHeartVisibility('hidden');
      if(star === targetStar) { //* matched
        star.classList.add('redStar'); //*** 
        matchedStarHowl.play();
        setTimeout(() => {
          let fadeId = matchedHowl.play();
          matchedHowl.fade(0.1, 0, 5000, fadeId);
          star.classList.remove('redStar');
          starWrapper.classList.add('inactive');
          image.src = `img/${matchedGirls[index].matched}.jpg`;
          setTimeout(() => { heartAppear()}, 0); //*
          muffin.classList.add('activate');
          index++;
        }, 1000);
        setTimeout(() => { //* step to next 
          resetGame();
          deleteSign(); //*
          matchedHowl.stop();
          activateHeart = true;
          hideMouseMoveRedHeart();
          replaceMouseMoveRedHeart()
          redHeartVisibility('visible');
          muffin.classList.remove('activate');
          image.src = `img/${matchedGirls[index].girl}.jpg`;
          starWrapper.classList.remove('inactive');
          targetStar = whiteStars[Math.floor(Math.random() * whiteStars.length)];
          starActive = false;
          // redStar(); //* targetStar Finder ---
        }, 6000);
      }
      if(star !== targetStar) { //* unMatched 
        activateHeart = false;
        redHeartVisibility('hidden');
        star.classList.add('blackStar');
        unmatchedStarHowl.play();
        setTimeout(() => {
          if(!changeMood) { unmatchedTwoHowl.play()}
          else { unmatchedHowl.play()}
          star.classList.remove('blackStar');
          starWrapper.classList.add('inactive');
          image.src = `img1/unMatched${Math.floor(Math.random() * unMatchedGirlsLength)+1}.jpg`;
          setTimeout(() => { msg.classList.add('activate'); phoneHowl.play()}, 1000);
          index++
        }, 1000);
        setTimeout(() => { //* back to before
          resetGame();
          activateHeart = true;
          hideMouseMoveRedHeart();
          replaceMouseMoveRedHeart()
          unmatchedHowl.stop();
          unmatchedTwoHowl.stop();
          phoneHowl.stop();
          redHeartVisibility('visible');
          msg.classList.remove('activate');
          image.src = `img/${matchedGirls[index].girl}.jpg`;
          starWrapper.classList.remove('inactive');
          targetStar = whiteStars[Math.floor(Math.random() * whiteStars.length)];
          starActive = false;
          // redStar(); //* targetStar Finder ---
        }, 7500); 
      }
    });
    star.addEventListener('touchstart', (e) => {
      if(!touch) { touch = true; e.stopPropagation()}
    });
    star.addEventListener('touchend', () => {
      setTimeout(() => { touch = false}, 200);
    });
  });
  
  function heartAppear() {
    const Length = floorRandomMinMax(10, 20);
    for (let i = 0; i < Length; i++) {
      const heartSign = document.createElement('i');
      heartSign.classList.add('fa-solid', 'fa-heart', 'heartSign');
      heartSign.style.color = `hsl(${floorRandomMinMax(300, 360)}, 100%, 50%)`;
      if(i === 0) { heartSign.style.fontSize = 150 + 'px'}
      else { heartSign.style.fontSize = floorRandomMinMax(10, 60) + 'px'}
      heartSign.style.rotate = floorRandomMinMax(-60, 60) + 'deg';
      heartSign.style.left = floorRandomMinMax(50, (innerWidth - 50)) + 'px';
      if(!startGame) { heartSign.style.top = floorRandomMinMax(80, (innerHeight - 80)) + 'px'}
      else { 
        if(mobile) { heartSign.style.top = floorRandomMinMax(200, (innerHeight - 80)) + 'px'}
        else { heartSign.style.top = floorRandomMinMax(300, (innerHeight - 80)) + 'px'}
      }
      if(!startGame) { splashScreen.appendChild(heartSign)}
      else { heartGrid.appendChild(heartSign)}
      if(!startGame) {
        setTimeout(() => {
          heartSign.style.left = floorRandomMinMax(50, (innerWidth - 50)) + 'px';
          heartSign.style.top = floorRandomMinMax(80, (innerHeight - 80)) + 'px';
          heartSign.style.rotate = floorRandomMinMax(-60, 60) + 'deg';
        }, 1400);
      }
    }
    const signs = heartGrid.querySelectorAll('.heartSign');
    setTimeout(() => {
      signs.forEach(sign => {sign.classList.add('active')});
    }, 500);
  }

  function deleteSign() {
    const signs = heartGrid.querySelectorAll('.heartSign');
    signs.forEach(sign => { sign.remove()});
  }

  function heartSplash(color) {
    const Length = floorRandomMinMax(80, 100);
    const angle = floorRandomMinMax(-65, 65);
    const landingPointX = floorRandomMinMax(10, 50);
    const landingPointY = floorRandomMinMax(10, 30);
    for (let i = 0; i < Length; i++) {
      const heartWrapper = document.createElement('div');
      heartWrapper.classList.add('heartWrapper');
      heartWrapper.style.left = landingPointX + 'px';
      heartWrapper.style.top = landingPointY + 'px';
      heartWrapper.style.transform = `rotate(${angle}deg)`;
      const heart = document.createElement('i');
      heart.classList.add('fa-solid','fa-heart', 'heart');
      heart.style.color = color;
      heart.style.fontSize = floorRandomMinMax(10, 30) + 'px';
      heartWrapper.appendChild(heart);
      splashScreen.appendChild(heartWrapper);
      setTimeout(() => { heartWrapper.style.opacity = 1}, 500);
    }
    setTimeout(() => {
      const heartWrappers = splashScreen.querySelectorAll('.heartWrapper');
      heartWrappers.forEach((heartWrapper, index) => {
        let distanceX, distanceY;
        if(mobile) { distanceX = floorRandomMinMax(-300, 300)}
        else { distanceX = floorRandomMinMax(-300, 600)}
        distanceY = floorRandomMinMax(-300, 300);
        let x = landingPointX + distanceX;
        let y = landingPointY + distanceY;
        heartWrapper.style.transform = '';
        heartWrapper.style.setProperty('--originX', floorRandomMinMax(-100, innerWidth/1.25) +'px');
        heartWrapper.style.setProperty('--originY', floorRandomMinMax(-100, 100) +'px');
        heartWrapper.style.setProperty('--rotate', floorRandomMinMax(100, 300) +'deg');
        heartWrapper.style.setProperty('--destinationY', innerHeight*2 +'px');
        if(index !== 0) {
          heartWrapper.style.left = x + 'px';
          heartWrapper.style.top = y + 'px';
        }
        const heart = heartWrapper.querySelector('.heart');
        heart.style.transform = `rotate(${floorRandomMinMax(0, 360)}deg)`;
        heart.style.color = `hsl(${floorRandomMinMax(300, 360)}, 100%, 50%)`;
        setTimeout(() => {
          heart.style.transform = '';
          heart.style.setProperty('--rotate', floorRandomMinMax(10, 360) +'deg');
          heartWrapper.classList.add('active');
          heart.classList.add('active');
          heartWrapper.addEventListener('animationend', () => { heartWrapper.remove()}); //*
        }, 500);
      });
    }, 1000);
  }
  
  function deleteHeart() {
    const heartWrappers = splashScreen.querySelectorAll('.heartWrapper');
    heartWrappers.forEach(heartWrapper => { heartWrapper.remove()});
  }

  function resetGame() {
    if(index === matchedGirls.length) { 
      setTimeout(() => {
        let fadeId = retryHowl.play();
        retryHowl.fade(0.05, 0, 16000, fadeId);
      }, 300);
      tid_pulse = setTimeout(() => btnEnter.classList.add('pulse'), 2000);
      splashScreen.style.transition = 0 +'s';
      splashScreen.classList.remove('inactive');
      btnEnter.classList.remove('active');
      btnEnter.textContent = 'RETRY';
      document.body.classList.remove('activate');
      figure.textContent = chars[0];
      index = 0; retry++;
      entered = false;
      setTimeout(() => { splashScreen.style.transition = ''}, 500);
      setTimeout(() => { heartSplash('#f00')}, 0);
      if(retry % 2 === 0) { changeMood = false} 
      else if(retry % 2 === 1) { changeMood = true}
      if(!sessionStorage.hasOwnProperty('retried')) {
        sessionStorage.setItem('retried', 'replay');
        warn.innerHTML = storeData;
        warn.classList.remove('inactive');
        warn.style.opacity = '';
      }
    }
  }
  
  function detectViewport() { 
    if(portrait) {
      if(innerHeight > defaultHeight) {
        menubar = false;
        splashScreen.classList.add('menubarHidden');
      } else if(innerHeight === defaultHeight) { 
        menubar = true;
        splashScreen.classList.remove('menubarHidden');
      }
    } 
    falseOrientation();
  } detectViewport();

  function falseOrientation() {
    if(!portrait) {
      if(innerHeight > defaultHeight) {
        menubar = false;
        splashScreen.classList.add('menubarHidden');
      } else if(innerHeight < defaultHeight) { 
        menubar = true;
        splashScreen.classList.remove('menubarHidden');
      }
      if(menubar) {
        portrait = window.matchMedia('(orientation: portrait)').matches;
        if(portrait) { defaultHeight = innerHeight}
      }
    }
  }

  function redHeartVisibility(state) {
    if(!mobile) { redHeart.style.visibility = state}
  }
  
  function floorRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min +1) + min);
  }

  window.addEventListener('resize', () => {
    video.src = 'mp4/cake.mp4';
    detectViewport();
  });


if(!mobile) { //* for desktop size ---
  if(innerHeight > 719) { 
    splashScreen.classList.add('menubarHidden');
  }
}

//* -------------------------------------------------
//* USE ONLY LOCAL TO TEST. TURN OFF WHEN DEPLOY ---
//* On desktop use mobile size ---

  // if(innerHeight > 719) { 
  //   splashScreen.classList.add('menubarHidden');
  // }

//* -------------------------------------------------
//* mobile Event ----------------------------------

  btnEnter.addEventListener('touchstart', (e) => {
    if(!touch) { touch = true; e.stopPropagation()}
  });
  btnEnter.addEventListener('touchend', () => {
    setTimeout(() => { touch = false}, 200);
  });

//* desktop Event mouseMove heart ----------------------------------

  if(!mobile) {
    heartGrid.addEventListener('mouseenter', function () {
      if(activateHeart) { redHeartVisibility('visible')}
    });
    heartGrid.addEventListener('mousemove', function (e) {
      redHeart.style.left = e.clientX + 'px';
      redHeart.style.top = e.clientY + 'px';
      lastRedHeartPosX = e.clientX + 'px';
      lastRedHeartPosY = e.clientY + 'px';
    });
    heartGrid.addEventListener('mouseleave', function () {
      redHeartVisibility('hidden');
      lastRedHeartPosX = -100 + 'px';
      lastRedHeartPosY = -100 + 'px';
    });
  } else { heartGrid.addEventListener('touchstart', e => e.preventDefault())} //*

  function hideMouseMoveRedHeart() {
    redHeart.style.left = -100 + 'px';
    redHeart.style.top = -100 + 'px';
  }

  function replaceMouseMoveRedHeart() {
    redHeart.style.left = lastRedHeartPosX;
    redHeart.style.top = lastRedHeartPosY;
  }
  
//* ----------------------------------------------------------------------
//* targetStar Finder ---

  function redStar() {
    whiteStars.forEach(star => {
      star.classList.remove('redStar');
      if(star === targetStar) {
        star.classList.add('redStar');
      }
    })
  }

//--------------------------------------------------------------------------------------









