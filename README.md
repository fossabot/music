# music

[![Donate](https://dl.ugjka.net/Donate-PayPal-green.svg)](https://www.paypal.me/ugjka)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fugjka%2Fmusic.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fugjka%2Fmusic?ref=badge_shield)

Stream your god damned music hassle free

## Note

use `-enableFlac` flag for flac support (not every browser supports flac file streaming)

use `-password yourpass` flag to protect the website with password

## Caveats

make sure your music is properly tagged, otherwise it will all be wonky

## install instructions

`go get -u github.com/ugjka/music`

`cd $GOPATH/src/github.com/ugjka/music/public`

`bower install`

`cd ..`

`go build`

`./music -path /path/to/mp3/collection -port 8080`

navigate in your browser to

`http://127.0.0.1:8080/`

Desktop view

![desktop](https://img.ugjka.net/1EICevTL.png)

![desktop](https://img.ugjka.net/FNYRvlRF.png)

Mobile lockscreen

![mobile](https://img.ugjka.net/XPdyMKUk.png)

Optional Password Protection

![password](https://img.ugjka.net/fI5L62ap.png)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fugjka%2Fmusic.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fugjka%2Fmusic?ref=badge_large)