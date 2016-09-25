var fs = require('fs');
var exec = require('child_process').exec;


if(!process.env.SUDO_UID){
  no_install();
}else{
  start_install();
}

function no_install(){
  console.log('WARNING: Did not install system service.');
  console.log('Please run `sudo npm install -g wakeshift`');
  console.log('if you wish to run wakeshift as a system service.');
}

function install_failed(message){
  console.error('Could not install. Message: ' + message);
  no_install();
}

function install_succeeded(){
  console.log('Install succeeded.');

  exec('service wakeshift start', function(err,o,e){
    if(err){
      install_failed('starting wakeshift service');
    }else{
      console.log(o);
    }
  });
}

function start_install(){
  exec('nbtscan -v',function(err,sto,ste){
    if(!err){
      yes_install();
    }else{
      exec('apt-get install -y nbtscan',function(err,sto,ste){
        if(!err){
          yes_install();
        }
      });
    }
  });
}

function yes_install(){
  var copycommand = '\\cp -fR ' + __dirname + '/files/wakeshift.sysv' + ' /etc/init.d/wakeshift';

  var updaterc = 'update-rc.d wakeshift defaults';

  exec(copycommand, function(err,sto,ste){
    if(err){
      install_failed('copy sysv');
      return;
    }else{
      exec(updaterc, function(er,o,e){
        if(er){
          install_failed('update-rc');
          return;
        }
        install_succeeded();
      })
    }
  });

}
