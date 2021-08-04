// What an ArtNet Package is made of //

/**
 * @this is an ArtNet Packet
 */
const ArtNetPacket = [
    65, 114, 116,  45,  78, 101, 116,
    0,    0,  80,   0,  14,   0,   0,
    0,    0,   0,   3,   0,   0, 121,
    0
]

// It consits of >>>

/**
 * @name ID
 * @typedef int8
 * Array of 8 characters, the final character is a
 * null termination.
 * 
 * Value = ‘A’ ‘r’ ‘t’ ‘-‘ ‘N’ ‘e’ ‘t’ 0x00
 */
let charArray = ['A', 'r', 't', '-', 'N', 'e', 't', String.fromCharCode(0x00)]
let ID = charArray.map(x => x.charCodeAt(0))
console.log(ID)



/**
 * @name OpCode
 * @typedef int16
 * OpOutput
 * Transmitted low byte first
 */
let OpOutput = 0x5000
let OpCode = [OpOutput & 0xff, OpOutput >> 8]
console.log(OpCode)



/**
 * @name ProtVerHi
 * @typedef int8
 * High byte of the Art-Net protocol revision
 * number. 
 */
let ProtVerHi = [0]
console.log(ProtVerHi)

/**
 * @name ProtVerLo
 * @typedef int8
 * Low byte of the Art-Net protocol revision
 * number. Current value 14
 */
let ProtVerLo = [14]
console.log(ProtVerLo)



/**
 * @name Sequence
 * @typedef int8
 * The sequence number is used to ensure that
 * ArtDmx packets are used in the correct order.
 * When Art-Net is carried over a medium such as
 * the Internet, it is possible that ArtDmx packets
 * will reach the receiver out of order.
 * This field is incremented in the range 0x01 to
 * 0xff to allow the receiving node to resequence
 * packets.
 * The Sequence field is set to 0x00 to disable this
 * feature.
 */
let Sequence = [0x00]
console.log(Sequence)



/**
 * @name Physical
 * @typedef int8
 * The physical input port from which DMX512
 * data was input. This field is for information
 * only. Use Universe for data routing.
 */
let Physical = [0x00]
console.log(Physical)



/**
 * @name SubUni
 * @typedef int8
 * The low byte of the 15 bit Port-Address to
 * which this packet is destined.
 */
let SubUni = [0]
console.log(SubUni)



/**
 * @name Net
 * @typedef int8
 * The top 7 bits of the 15 bit Port-Address to
 * which this packet is destined.
 */
let Net = [0]
console.log(Net)


/**
 * @name LengthHi
 * @typedef int8
 * The length of the DMX512 data array. This
 * value should be an even number in the range 2
 * – 512.
 * It represents the number of DMX512 channels
 * encoded in packet. NB: Products which convert
 * Art-Net to DMX512 may opt to always send 512
 * channels.
 * High Byte.
 */
let channelCount = 512
let LengthHi = [channelCount >> 8]
console.log(LengthHi)

/**
 * @name Length
 * @typedef int8
 * Low Byte of above.
 */
let Length = [channelCount & 0xff]
console.log(Length)


/**
 * @name Data[Length]
 * @typedef int8
 * A variable length array of DMX512 lighting
 * data.
 */
// let Data = [255, 0, 0, 0, 255, 0]
let Data = new Array(512).fill(0)
console.log(Data)


function constructArtNetPacket() {
    return [
        ...ID,
        ...OpCode,
        ...ProtVerHi,
        ...ProtVerLo,
        ...Sequence,
        ...Physical,
        ...SubUni,
        ...Net,
        ...LengthHi,
        ...Length,
        ...Data
    ]
}



// NOW lets send our packet
import dgram from 'dgram'

const socket = dgram.createSocket({type: 'udp4', reuseAddr: true})

var selfmadeArtNetPacket = constructArtNetPacket()
var buffer = new Uint8Array(selfmadeArtNetPacket);
console.log(selfmadeArtNetPacket)

socket.bind(6454, "2.0.0.42", function () {
    socket.setBroadcast(true);
});

function sendPacket() {
    socket.send(buffer, 0, buffer.length, 6454, "255.255.255.255");
}

function changeData(channel: number, operation: boolean) {
    if (operation && Data[channel] <= 250) {
        Data[channel] += 5
        selfmadeArtNetPacket = constructArtNetPacket()
        buffer = new Uint8Array(selfmadeArtNetPacket)
        console.log(`Channel ${channel+1} at ${Data[channel]}`)
    } else if (!operation && Data[channel] >= 5) {
        Data[channel] -= 5
        selfmadeArtNetPacket = constructArtNetPacket()
        buffer = new Uint8Array(selfmadeArtNetPacket)
        console.log(`Channel ${channel+1} at ${Data[channel]}`)
    }
}

function updateData(data: number[]) {
    Data = data
    selfmadeArtNetPacket = constructArtNetPacket()
    buffer = new Uint8Array(selfmadeArtNetPacket)
    console.log(`New Data: ${data}`)
}

function updateChannel(channel: number, value: number) {
    Data[channel] = value
    selfmadeArtNetPacket = constructArtNetPacket()
    buffer = new Uint8Array(selfmadeArtNetPacket)
    console.log(`Channel ${channel+1} at ${Data[channel]}`)
}

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    //   console.log('got "keypress"', key);
    if (key && key.ctrl && key.name == 'c') {
        process.exit(0);
    } else if (key) {
        switch (key.name) {
            case 'q':
                changeData(0, true)
                break
            case 'a':
                changeData(0, false)
                break
            case 'w':
                changeData(1, true)
                break
            case 's':
                changeData(1, false)
                break
            case 'e':
                changeData(2, true)
                break
            case 'd':
                changeData(2, false)
                break
            case 'r':
                changeData(3, true)
                break
            case 'f':
                changeData(3, false)
                break
            case 't':
                changeData(4, true)
                break
            case 'g':
                changeData(4, false)
                break
            case 'z':
                changeData(5, true)
                break
            case 'h':
                changeData(5, false)
                break
        }
    }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();

import express from "express";
const app = express()
const port = 3000

app.use(express.static('public'));

app.post('/:channel/:value', (req, res) => {
    updateChannel(parseInt(req.params.channel), parseInt(req.params.value))
    return res.send(`Set Channel ${req.params.channel} at ${req.params.value}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

setInterval(sendPacket, 1000/30)