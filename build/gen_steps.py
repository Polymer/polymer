"""Step generator script for the annotated Toolkit builders.

For more information, see scripts/slave/annotated_run.py in
https://chromium.googlesource.com/chromium/tools/build/"""

def GetSteps(api, _factory_properties, build_properties):
  steps = api.Steps(build_properties)
  return [
    steps.step('update-install',
               ['npm', 'install'],
               cwd=api.checkout_path()),
    steps.step('test-chrome',
               ['xvfb-run', 'grunt', 'testacular:chrome'],
               cwd=api.checkout_path(), always_run=True),
    steps.step('test-firefox',
               ['xvfb-run', 'grunt', 'testacular:firefox'],
               cwd=api.checkout_path(), always_run=True),
  ]
