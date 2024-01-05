const canvas = document.getElementById('particle-canvas')

let ctx

if (document.querySelector('canvas')) {
    ctx = canvas.getContext('2d')
}

const particles = []

// Detect screen width to determine whether it's a desktop or mobile
const screenWidth = window.innerWidth || document.documentElement.clientWidth

// Define the number of particles based on screen size
let numParticles
if (screenWidth >= 950) { // You can adjust this threshold as needed
    numParticles = 350 // For desktop screen size
} else {
    numParticles = 180 // For mobile screen size
}

if (document.querySelector('canvas')) {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = Math.random() * 3 + 1
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 10) + 1
        this.angle = Math.random() * 360
        this.distance = (Math.random() * 50) + 120
    }

    draw() {
        ctx.fillStyle = '#4A968A'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }

    update() {
        this.x = this.baseX + Math.cos(this.angle) * this.distance
        this.y = this.baseY + Math.sin(this.angle) * this.distance
        this.angle += 0.003 // Adjust the speed here

        // Repel from mouse cursor
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x
            const dy = this.y - mouse.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = 150 // Adjust the minimum distance to repel particles
            if (distance < minDistance) {
                const force = (minDistance - distance) / minDistance // Smooth and slow repelling
                this.x += dx * force
                this.y += dy * force
            }
        }
    }

    connect(particles) {
        for (let i = 0; i < particles.length; i++) {
            const distance = this.getDistance(particles[i])
            if (distance < 120) {
                ctx.strokeStyle = 'rgba(74, 150, 138, ' + (1 - distance / 120) + ')'
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                ctx.lineTo(particles[i].x, particles[i].y)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }

    getDistance(particle) {
        const dx = this.x - particle.x
        const dy = this.y - particle.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}

function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push(new Particle(x, y))
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const particle of particles) {
        particle.update()
        particle.draw()
        particle.connect(particles)
    }

    requestAnimationFrame(animate)
}

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}



// Handle mouse interaction
const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', e => {
    mouse.x = e.x
    mouse.y = e.y
})


window.addEventListener('mouseout', () => {
    mouse.x = undefined
    mouse.y = undefined
})

if (document.querySelector('canvas')) {
    window.addEventListener('resize', resizeCanvas)
    createParticles()
    animate()
}



// Slider
const sliders = (slides, dir, prev, next) => {
    let slideIndex = 1,
        paused = false

    const items = document.querySelectorAll(slides)

    function showSlides(n) {
        if (n > items.length) {
            slideIndex = 1
        }

        if (n < 1) {
            slideIndex = items.length
        }

        items.forEach(item => {
            item.classList.add('animated')
            item.style.display = 'none'
        })

        items[slideIndex - 1].style.display = 'block'
    }

    showSlides(slideIndex)

    function plusSlides(n) {
        showSlides(slideIndex += n)
    }

    try {
        const prevBtn = document.querySelector(prev),
            nextBtn = document.querySelector(next)

        prevBtn.addEventListener('click', () => {
            plusSlides(-1)
            items[slideIndex - 1].classList.remove('slideInLeft')
            items[slideIndex - 1].classList.add('slideInRight')
        })

        nextBtn.addEventListener('click', () => {
            plusSlides(1)
            items[slideIndex - 1].classList.remove('slideInRight')
            items[slideIndex - 1].classList.add('slideInLeft')
        })
    } catch (e) { }


    function activateAnimation() {
        if (dir === 'vertical') {
            paused = setInterval(function () {
                plusSlides(1)
                items[slideIndex - 1].classList.add('slideInDown')
            }, 3000)
        } else {
            paused = setInterval(function () {
                plusSlides(1)
                items[slideIndex - 1].classList.remove('slideInRight')
                items[slideIndex - 1].classList.add('slideInLeft')
            }, 3000)
        }
    }

    // activateAnimation();

    items[0].parentNode.addEventListener('mouseenter', () => {
        clearInterval(paused)
    })

    items[0].parentNode.addEventListener('mouseleave', () => {
        activateAnimation()
    })
}
// sliders('.featured-inner', 'horizontal', '.prev-featured', '.next-featured')


function sliderMore(containerSlider, trackSlider, prevSlide, nextSlide, sliders) {

    let position = 0
    let slidesToShow = 3

    if (window.innerWidth <= 1100) {
        slidesToShow = 2
    }

    if (window.innerWidth <= 600) {
        slidesToShow = 1
    }

    const slidesToScroll = 1
    const container = document.querySelector(containerSlider)
    const track = document.querySelector(trackSlider)

    const btnPrev = document.querySelector(prevSlide)
    const btnNext = document.querySelector(nextSlide)
    const items = document.querySelectorAll(sliders)

    const itemsCount = items.length
    const itemWidth = container.clientWidth / slidesToShow
    const movePosition = slidesToScroll * itemWidth

    items.forEach((item) => {
        item.style.minWidth = `${itemWidth - 15}px`
    })

    btnNext.addEventListener('click', () => {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth

        position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth

        setPosition()
        checkBtns()
    })


    btnPrev.addEventListener('click', () => {

        const itemsLeft = Math.abs(position) / itemWidth

        position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth

        setPosition()
        checkBtns()
    })

    const setPosition = () => {
        track.style.transform = `translateX(${position}px)`
    }

    const checkBtns = () => {
        btnPrev.disabled = position === 0
        btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth
    }

    checkBtns()
}

if (document.querySelector('.slider-container-sale')) {

    sliderMore('.slider-container-sale', '.sale-slider-track', '.prev-sale', '.next-sale', '.sale-slide')

    sliderMore('.slider-container-rent', '.rent-slider-track', '.prev-rent', '.next-rent', '.rent-slide')
}

if (document.querySelector('.slider-container-lifestyle')) {
    sliderMore('.slider-container-lifestyle', '.lifestyle-slider-track', '.prev-lifestyle', '.next-lifestyle', '.box-item')
}

function sliderCont(sliderContent, sliderListElem, trackSlider, slideItem, arrow, prevBtn, nextBtn) {

    let slider = document.querySelector(sliderContent),
        sliderList = slider.querySelector(sliderListElem),
        sliderTrack = slider.querySelector(trackSlider),

        slides = slider.querySelectorAll(slideItem),
        arrows = document.querySelector(arrow),
        prev = document.querySelector(prevBtn),
        next = document.querySelector(nextBtn),

        slideWidth = slides[0].offsetWidth,
        slideIndex = 0,
        posInit = 0,
        posX1 = 0,
        posX2 = 0,
        posY1 = 0,
        posY2 = 0,
        posFinal = 0,
        isSwipe = false,
        isScroll = false,
        allowSwipe = true,
        transition = true,
        nextTrf = 0,
        prevTrf = 0,
        lastTrf = --slides.length * slideWidth,
        posThreshold = slides[0].offsetWidth * 0.35,
        trfRegExp = /([-0-9.]+(?=px))/,
        swipeStartTime,
        swipeEndTime,

        getEvent = function () {
            return (event.type.search('touch') !== -1) ? event.touches[0] : event
        },

        slide = function () {
            if (transition) {
                sliderTrack.style.transition = 'transform .5s'
            }
            sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`

            prev.classList.toggle('disabled', slideIndex === 0)
            next.classList.toggle('disabled', slideIndex === --slides.length)
        },

        swipeStart = function () {
            let evt = getEvent()

            if (allowSwipe) {

                swipeStartTime = Date.now()

                transition = true

                nextTrf = (slideIndex + 1) * -slideWidth
                prevTrf = (slideIndex - 1) * -slideWidth

                posInit = posX1 = evt.clientX
                posY1 = evt.clientY

                sliderTrack.style.transition = ''

                document.addEventListener('touchmove', swipeAction)
                document.addEventListener('mousemove', swipeAction)
                document.addEventListener('touchend', swipeEnd)
                document.addEventListener('mouseup', swipeEnd)

                sliderList.classList.remove('grab')
                sliderList.classList.add('grabbing')
            }
        },

        swipeAction = function () {

            let evt = getEvent(),
                style = sliderTrack.style.transform,
                transform = +style.match(trfRegExp)[0]

            posX2 = posX1 - evt.clientX
            posX1 = evt.clientX

            posY2 = posY1 - evt.clientY
            posY1 = evt.clientY

            if (!isSwipe && !isScroll) {
                let posY = Math.abs(posY2)
                if (posY > 7 || posX2 === 0) {
                    isScroll = true
                    allowSwipe = false
                } else if (posY < 7) {
                    isSwipe = true
                }
            }

            if (isSwipe) {
                if (slideIndex === 0) {
                    if (posInit < posX1) {
                        setTransform(transform, 0)
                        return
                    } else {
                        allowSwipe = true
                    }
                }

                // запрет ухода вправо на последнем слайде
                if (slideIndex === --slides.length) {
                    if (posInit > posX1) {
                        setTransform(transform, lastTrf)
                        return
                    } else {
                        allowSwipe = true
                    }
                }

                if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                    reachEdge()
                    return
                }

                sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`
            }

        },

        swipeEnd = function () {
            posFinal = posInit - posX1

            isScroll = false
            isSwipe = false

            document.removeEventListener('touchmove', swipeAction)
            document.removeEventListener('mousemove', swipeAction)
            document.removeEventListener('touchend', swipeEnd)
            document.removeEventListener('mouseup', swipeEnd)

            sliderList.classList.add('grab')
            sliderList.classList.remove('grabbing')

            if (allowSwipe) {
                swipeEndTime = Date.now()
                if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
                    if (posInit < posX1) {
                        slideIndex--
                    } else if (posInit > posX1) {
                        slideIndex++
                    }
                }

                if (posInit !== posX1) {
                    allowSwipe = false
                    slide()
                } else {
                    allowSwipe = true
                }

            } else {
                allowSwipe = true
            }

        },

        setTransform = function (transform, comapreTransform) {
            if (transform >= comapreTransform) {
                if (transform > comapreTransform) {
                    sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`
                }
            }
            allowSwipe = false
        },

        reachEdge = function () {
            transition = false
            swipeEnd()
            allowSwipe = true
        }

    sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'
    sliderList.classList.add('grab')

    sliderTrack.addEventListener('transitionend', () => allowSwipe = true)
    slider.addEventListener('touchstart', swipeStart)
    slider.addEventListener('mousedown', swipeStart)

    arrows.addEventListener('click', function () {
        let target = event.target

        if (target.classList.contains(nextBtn.slice(1))) {
            slideIndex++
        } else if (target.classList.contains(prevBtn.slice(1))) {
            slideIndex--
        } else {
            return
        }

        slide()
    })
}

if (document.querySelector('.slider-featured')) {

    sliderCont('.slider-featured', '.featured-slider-list', '.featured-slider-track', '.featured-inner', '.featured-arrow', '.prev-featured', '.next-featured')

    sliderCont('.slider-news', '.news-slider-list', '.news-slider-track', '.news-inner', '.news-arrow', '.prev-news', '.next-news')
}


if (document.querySelector('.slider-area')) {
    sliderCont('.slider-area', '.area-slider-list', '.area-slider-track', '.area-wrapper', '.area-arrow', '.prev-area', '.next-area')
}

if (document.querySelector('.slider_service')) {
    sliderCont('.slider_service', '.slider-service-list', '.slider-service-track', '.other-inner', '.service-arrow', '.prev-service', '.next-service')
}


const debounce = (callback, delay) => {
    let timeout = null

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(callback, delay, ...args)
    }
}

const elements = document.querySelectorAll('.home-service-item')
const debouncedResize = debounce(
    () => {
        if (window.innerWidth <= 491) {
            // 0...768
            for (let element of elements) {
                element.classList.add('slider-service-list')
            }
            sliderCont('.slider-service', '.slider-service-list', '.home-service-track', '.home-service-item', '.services-arrow', '.prev-services', '.next-services')
        } else {
            // 769...Inf
            for (let element of elements) {
                element.classList.remove('slider-service-list')
            }
            document.querySelector('.home-service-track').style.transform = `translate3d(0px, 0px, 0px)`
        }
    },
    50
)

if (document.querySelector('.home-service-track')) {
    debouncedResize()
    window.addEventListener('resize', debouncedResize)
}




// Accordion

const accordion = (triggersSelector) => {
    const btns = document.querySelectorAll(triggersSelector)

    btns.forEach(btn => {
        btn.addEventListener('click', function () {

            btns.forEach(btn => {
                if (!this.classList.contains('active-style')) {

                    btn.classList.remove('active-style')

                    btn.nextElementSibling.classList.remove('active-content')

                    btn.nextElementSibling.style.maxHeight = 0 + 'px'
                }

            })

            this.classList.toggle('active-style')
            this.nextElementSibling.classList.toggle('active-content')

            if (this.classList.contains('active-style')) {
                this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 80 + 'px'
            } else {
                this.nextElementSibling.style.maxHeight = '0px'
            }
        })

        btns.forEach(btn => {


            if (btn.classList.contains('active-style')) {
                console.log('aaa')
                btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 80 + 'px'
            } else {
                btn.nextElementSibling.style.maxHeight = '0px'
            }
        })


    })

}

if (document.querySelector('.faq-heading')) {
    accordion('.faq-heading')
}




// Tabs Page CP Area
const filter = () => {
    const menu = document.querySelector('.portfolio-menu')
    const items = document.querySelectorAll('.portfolio-item')

    const wrapper = document.querySelector('.portfolio-wrapper')
    const mapOne = wrapper.querySelectorAll('.all')


    const typeFilter = (markType) => {
        mapOne.forEach(elem => {

            elem.style.display = 'none'
            elem.classList.remove('animated', 'fadeIn')
        })

        if (markType) {
            markType.forEach(mark => {
                mark.style.display = 'block'
                mark.classList.add('animated', 'fadeIn')
            })
        }
    }

    menu.addEventListener('click', (e) => {
        let classSelect = e.target.classList[0]
        let allElems = wrapper.querySelectorAll(`.${classSelect}`)
        typeFilter(allElems)
    })

    menu.addEventListener('click', (e) => {
        let target = e.target

        if (target && target.tagName === 'LI') {
            items.forEach(btn => btn.classList.remove('active'))
            target.classList.add('active')
        }
    })
}


if (document.querySelector('.area_map')) {
    filter()
}

