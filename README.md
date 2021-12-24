# wiimote-band-hero-driver-linux

Linux "Userspace Driver" for the Band Hero Wii Remote Guitar. Meant to be used with Clone Hero

A GUI is coming for this made in electron.

I don't really know if this can be considered a usersapce driver, but it's close enough. Runs in userspace and interacts with hardware but needs to be run manually.

This driver will eventually be rewritten in C and try and interact with a Clone Hero API if that exists. But for now, it's pretty expiremental.

The goal for this project is that there isn't support for the Band Hero Guitar for Wii, or at least as far as i'm aware, so I made this with my recent addiction to everything Guitar Hero.

# How to use

## Working Bluetooth

Ensure you have properly working Bluetooth on your Linux system. Try connecting an Xbox controller or something similar to test it out

## Install XWiimote

Install the XWiimote device driver so my driver can use it to detect Wiimotes

[[AUR Link]](https://aur.archlinux.org/packages/xwiimote-git/) [[Upstream GitHub Page]](https://dvdhrm.github.io/xwiimote/)

## Install Node.js

Required for now, It should be pretty easy to install on whatever distro you're using, Google it if you need help

## Connect your Wiimote

Connect your Wiimote over Bluetooth using the red **SYNC** button under the Wiimote battery lid and using BlueZ to pair and connect it.

`blueman-manager` is a great Bluetooth program but for whatever reason it will not detect my Wiimote so I ended up using the CLI program `bluetoothctl` that should come preinstalled with the BlueZ program stack. To use bluetoothctl to connect your Wiimote:

- Run the `bluetoothctl` command in your shell
- It should bring you to a new CLI that will say `[bluetooth]# ` where you can input a command.
- Running `help` will give you the basics
- run `power on` to turn your Bluetooth adapter on if not already running.
- run `scan on` to search around you for devices, now is when you should press the SYNC button
- You'll end up seeing something like below but with the A's replaced with a real address.
- `[CHG] Device AA:AA:AA:AA:AA:AA Name: Nintendo RVL-CNT-01`
- Copy the address and run `pair AA:AA:AA:AA:AA:AA` then `connect AA:AA:AA:AA:AA:AA` replacing the A's with the copied real address.
- Do it fast otherwise the Wiimote might turn off.

If your Bluetooth program asks for a PIN, leave it blank, however this shouldn't pop up with a proper version of BlueZ. Some distros will compile BlueZ without the Wiimote plugin, which isn't required, but it makes your life easier as I'm using the plugin whilst developing this. The plugin has been available since BlueZ 4.96 but it's up to your distro to package the plugin with BlueZ. If you find yourself having to compile BlueZ manually to get said plugin, be sure to use the argument `--enable-wiimote` during compilation to use the plugin.

## Run the driver
