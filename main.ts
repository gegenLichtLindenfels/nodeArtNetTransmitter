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
console.log(ArtNetPacket)

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
let channelCount = 2
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
let Data = [0, 0]
console.log(Data)

const selfmadeArtNetPacket = [
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

console.log(selfmadeArtNetPacket)



// NOW lets send our packet
import dgram from 'dgram'
const socket = dgram.createSocket({type: 'udp4', reuseAddr: true}) 
socket.bind( 6454, "0.0.0.0", function () { socket.setBroadcast(true) } )

const buffer = new Uint8Array(selfmadeArtNetPacket);

socket.send(buffer, 0, buffer.length, 6454, "255.255.255.255", function(err) {
    if (err) { console.log(err) }
    socket.close()
});