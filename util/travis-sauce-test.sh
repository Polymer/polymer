#!/usr/bin/env bash
#
# @license
# Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
#
set -x
node ./node_modules/.bin/polymer test --npm --module-resolution=node -s 'windows 10/microsoftedge@15' -s 'windows 10/microsoftedge@17' -s 'windows 8.1/internet explorer@11' -s 'os x 10.11/safari@9' -s 'macos 10.12/safari@10' -s 'macos 10.13/safari@11' -s 'Linux/chrome@41'