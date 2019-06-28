import _ from 'lodash';
import $ from 'jquery';
import './index.less';
import Img from './images/googlelogo_color_272x92dp.png';

function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  var myIcon = new Image();
  myIcon.src = Img;
  element.appendChild(myIcon);
  return element;
}

document.body.appendChild(component());