Vagrant.configure("2") do |config|

  # > vagrant up tools    old image "ubuntu/xenial64"
  config.vm.define "tools", autostart: false do |h|
    h.vm.box = "sushilshimpi/ionic-node6-jdk8" 
    h.vm.provider "virtualbox" do |v|
      v.name = "tools"
      v.memory = 4000
      v.cpus = 4
    end
  end

  config.vm.network "public_network"
  config.vm.network "forwarded_port", guest: 7112, host: 7112
  config.vm.synced_folder ".", "/home/ubuntu/hitesh"
end