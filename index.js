/* 
* @Author: huitre
* @Date:   2015-10-09 22:18:51
* @Last Modified by:   huitre
* @Last Modified time: 2015-10-10 16:38:02
*/

'use strict';

require('babel/register')({
	only: /server/
});

module.exports = require('./server/app.js');