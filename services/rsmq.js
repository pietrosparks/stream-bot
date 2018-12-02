const RedisSMQ = require('rsmq-promise')

function createRsmq() {
  const rsmq = new RedisSMQ({ host: '127.0.0.1', port: 6379, ns: 'rsmq', realtime: true})

  return {
    createQueue(name) {
      return rsmq
        .createQueue({ qname: name })
        .then(done => console.log(done, 'Queue Created'))
        .catch(err => console.log(err))
    },
    sendMessage(queue, message) {
      return rsmq
        .sendMessage({ qname: queue, message })
        .then(result => console.log(`Message Sent to ${queue}`,result))
        .catch(err => console.log(err))
    },
    listQueues() {
      return rsmq
        .listQueues()
        .then(queues => console.log(queues), 'List Queues')
        .catch(err => console.log(err))
    },
    receiveMessage(queue) {
      return rsmq
        .receiveMessage({ qname: queue })
        .then(message => console.log(message, `Queue ${queue} recieved message`))
        .catch(err => console.log(err))
    },
    deleteMessage(queue, messageid) {
      return rsmq
        .deleteMessage({
          qname: queue,
          id: messageid
        })
        .then(result => console.log(result, 'Message deleted.'))
        .catch(err => console.log('Message not found.'))
    },
    deleteQueue(queue) {
      return rsmq
        .deleteQueue({
          qname: queue
        })
        .then(result => console.log(result, 'Queue deleted.'))
        .catch(err => console.log('Message not found.'))
    },
    quit() {
      return rsmq
        .quit()
        .then(success => console.log(success))
        .catch(err => console.log(err))
    }
  }
}

module.exports = createRsmq()
