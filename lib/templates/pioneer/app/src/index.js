import _ from 'lodash';
import $ from 'jquery';
import './index.less';
import Img from './images/2019-womens-world-cup-day-17-5428967486521344-law.gif';

function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  var myIcon = new Image();
  myIcon.src = Img;
  element.appendChild(myIcon);
  return element;
}

document.body.appendChild(component());