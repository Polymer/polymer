"""Step generator script for the annotated Toolkit builders.

For more information, see scripts/slave/annotated_run.py in
https://chromium.googlesource.com/chromium/tools/build/"""

def GetSteps(_api, build_properties):
  return [
      {'name': 'update-install',
       'cmd': ['npm', 'install'],
       'cwd': ['toolkit']},
      {'name': 'grunt-test',
       'cmd': ['grunt', 'test'],
       'cwd': ['toolkit']}
  ]
