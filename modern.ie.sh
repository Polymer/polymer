#!/bin/bash

runIE() {
  VBoxManage guestcontrol "IE10 - Win8" exec --username IEUser --image "C:\\Program Files\\Internet Explorer\\iexplore.exe" --password 'Passw0rd!' --wait-exit -- "$1"
}

killIE() {
  VBoxManage guestcontrol "IE10 - Win8" exec --username IEUser --image "C:\\Windows\\system32\\taskkill.exe" --password 'Passw0rd!' --wait-exit -- /IM iexplore.exe /F
}

trap "killIE; exit 0" EXIT

url=$1
runIE "${url/localhost/10.0.2.2}"
