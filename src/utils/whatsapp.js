export const whatsapp = (message = 'Hello Dhan sing i have visited your website') => {
    const url = `https://wa.me/977${9862772457}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
}