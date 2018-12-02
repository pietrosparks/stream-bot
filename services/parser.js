const axios = require('axios')

const urlify = (text, final) => {
  var urlRegex = /(https?:\/\/[^\s]+)/g
  if (text.match(urlRegex)) {
    return text.replace(urlRegex, url => {
      url = url.replace(/\)$/, '')
      final.push(url)
      return `<a href="${url}">${url}</a>`
    })
  }
  return
}

async function getLinksForKeyword(keyword) {
  const finalLinks = []

  try {
    const openStreamPage = await axios.get(
      'https://www.reddit.com/r/soccerstreams.json'
    )

    const openStreamChildren = openStreamPage.data.data.children
    const streamKind = openStreamChildren
      .filter(c => c.kind === 't3')
      .map(c => c.data)
    const streamChosen = streamKind
      .find(k => k.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
      .url.replace(/\/$/, '')

    const openLinkPage = await axios.get(`${streamChosen}.json`)
    const openLinkChildren = openLinkPage.data
    const linkKind = openLinkChildren[openLinkChildren.length - 1].data.children
      .filter(c => c.kind === 't1')
      .map(c => c.data)
      .map(c => urlify(c.body, finalLinks))
      .filter(c => c !== undefined)

    const nonDiscordRegex = /(https?:\/\/discord+)/gi
    const filterDiscord = finalLinks.filter(
      link => !link.match(nonDiscordRegex)
    )

    console.log(filterDiscord, ' filtered links')
    return filterDiscord

    // postTweet(`${search} returned ${finalLinks[0]}`);
    // getMentions()
  } catch (err) {
    console.log(err, 'error')
  }
}

module.exports = {
  getLinksForKeyword
}
