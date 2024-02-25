# VCReconnect
## Never wake up without your significant other again

VCReconnect is a simple plugin for BetterDiscord that allows you to automatically reconnect to a voice channel when you get disconnected.
It adds a lock vc button to your user panel that when locked will automatically reconnect you to the voice channel you specify in the settings.
You need to have the server the vc is in open for this to work.

### Options
- **channelId**: The ID of the voice channel you want to reconnect to. ***You must set this option.***
- **UserName**: Your username. ***You must set this option.*** | *todo: get the user's name from the client*
- **reconnectDelay**: The delay in milliseconds before attempting to reconnect. Default is 5000ms.

### Future improvements
- Get the user's name from the client
- Possible event based reconnecting
- Lock the currently connected vc, instead of the one specified in the settings

### Installation
1. Install the plugin like any other
2. Go to the settings and set the channelId and UserName options
3. Lock the vc and enjoy
4. If you want to unlock the vc, just click the lock button again