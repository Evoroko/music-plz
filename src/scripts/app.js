import gsap from "../../node_modules/gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('.canvas');

if(canvas){

    const scene = new THREE.Scene()
    function RandomNum(min, max){
        const n = min + (Math.random() * ((max + 1) - min));
        return n;
    }

    function RandomNumNoCenter(min, max){
        let n = min + (Math.random() * ((max + 1) - min));
        const average = (max + min) / 2;
        const minMiddleRange = average - 3;
        const maxMiddleRange = average + 3;
        while(n < maxMiddleRange && n > minMiddleRange){
            n = min + (Math.random() * ((max + 1) - min));
        }
        return n;
    }

    // Texture
    const textureLoader = new THREE.TextureLoader()
    const textureToon = textureLoader.load('./assets/images/texture.jpg');
    const textureAlpha = textureLoader.load('./assets/images/alpha1.png');
    const textureAlpha2 = textureLoader.load('./assets/images/alpha2.png');
    const textureAlpha3 = textureLoader.load('./assets/images/alpha3.png');
    textureToon.magFilter = THREE.NearestFilter;
    
    const material = new THREE.MeshToonMaterial({ color: '#ffeded', gradientMap: textureToon });
    const materialAlpha = new THREE.MeshBasicMaterial({ color: '#ffeded', alphaMap: textureAlpha, transparent: true });
    const materialAlpha2 = new THREE.MeshBasicMaterial({ color: '#ffeded', alphaMap: textureAlpha2, transparent: true });
    const materialAlpha3 = new THREE.MeshBasicMaterial({ color: '#ffeded', alphaMap: textureAlpha3, transparent: true });
    const geometryBox = new THREE.BoxGeometry(1, 1, 1);
    const geometryPlane = new THREE.PlaneGeometry(1, 1);
    
    
    
    // Create Mesh
    function createBoxMesh(x, y, z, scaleX, scaleY){
        const mesh = new THREE.Mesh(
            geometryBox,
            material);
        
        mesh.position.set(x, y, z);
        mesh.scale.set(scaleX, scaleY, 1);
        
        scene.add(mesh);
    }
    
    function createPlaneMesh(x, y, z, scaleX, scaleY, rotationZ, material){
        const mesh = new THREE.Mesh(
            geometryPlane,
            material);
        
        mesh.position.set(x, y, z);
        mesh.scale.set(scaleX, scaleY, 1);
        mesh.rotation.z = rotationZ;
        
        scene.add(mesh);
    }

    // Place elements in the scene
    for(let i = 0; i < 150; i++){
        createBoxMesh(RandomNumNoCenter(-20, 20), RandomNumNoCenter(-15, 15), RandomNum(-3, -200), RandomNum(2, 3), RandomNum(2, 4));
    }
    createPlaneMesh(2, -2, 5, 10, 10, 0, materialAlpha);
    createPlaneMesh(-10, 5, -5, 20, 20, Math.PI, materialAlpha);
    createPlaneMesh(-10, 10, -50, 40, 40, Math.PI, materialAlpha2);
    createPlaneMesh(2, -2, -70, 70, 70, Math.PI, materialAlpha3);
    createPlaneMesh(2, 2, -30, 80, 50, 0, materialAlpha3);
    createPlaneMesh(4, -4, -100, 70, 70, Math.PI, materialAlpha);
    
    // Size
    let width = window.innerWidth,
        height = window.innerHeight;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(70, width / height);
    scene.add(camera);
    
    // Fog
    const fog = new THREE.Fog('rgba(8,21,38,1)', 1, 50)
    scene.fog = fog

    // Light
    const light = new THREE.DirectionalLight('#A9D0D9', 1);
    light.position.set(1, 3, 2);
    scene.add(light);
    
    
    // Resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
    
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.render(scene, camera);
    })
    
    // Scroll
    let scroll = window.scrollY;
    
    window.addEventListener('scroll', () => {
        scroll = window.scrollY;
    })
    
    // Cursor
    let cursorX = 0;
    let cursorY = 0;
    
    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    })
    
    
    // Render
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    })
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setAnimationLoop(animation);
    
    // Animation
    
    function animation() {
        camera.position.z = 10 - scroll / 75;
        camera.rotation.y = ((width / 2) - cursorX) / 10000;
        camera.rotation.x = ((height / 2) - cursorY) / 10000;
    
        renderer.render(scene, camera);
    }
}


// Burger Menu

const burgerBtn = document.querySelector('#burger');
const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
const pageTransition = document.querySelector('.pageTransition');
const links = document.querySelectorAll('.link');


for(let link of links){
    link.addEventListener('click', (e) => {
        let currentLink = link.href;
        pageTransition.classList.add('pageTransition--beforeExit');

        pageTransition.addEventListener('animationend', () => {
            window.location = currentLink;
        })

        e.preventDefault();
    })
}

burgerBtn.addEventListener('click', () => {
    if(menu.classList.contains('menu--invisible')){
        gsap.from('.menu__el', {
            opacity: 0,
            x: -100,
            duration: 0.5,
            stagger: 0.1
        })
        toggleMenu();
    }else{
        gsap.to('.menu__el', {
            opacity: 0,
            x: 20,
            duration: 0.3,
            stagger: 0.05
        })
        setTimeout(() => {
            toggleMenu();
            gsap.to('.menu__el', {
                opacity: 1,
                x: 0
            })
        }, 315);
    }
});

function toggleMenu(){
    menu.classList.toggle('menu--invisible');
    burgerBtn.classList.toggle('nav__btn--close');
    header.classList.toggle('header--open');
}


// Slider

const albumSlider = document.querySelector('.album');
const playBtns = document.querySelectorAll('.player');
const albumsElements = document.querySelectorAll('.album__el');

if(albumSlider){
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const slideStates = document.querySelectorAll('.album__current');
    const hammerSlider = new Hammer(albumSlider);
    let focus = 0;

    if(window.matchMedia('(min-width: 992px)').matches){
        for(let albumsElement of albumsElements){
            albumsElement.addEventListener('click', () => {
                removeFocus();
                albumsElement.classList.add('album__el--focus');
                replaceCurrentFocus();
            })
        }
    }
    
    

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    hammerSlider.on('swiperight', prevSlide);
    hammerSlider.on('swipeleft', nextSlide);

    function prevSlide(){
        const currentSlide = document.querySelector('.album__el--focus');
        let prevSlide = currentSlide.previousElementSibling;

        if(prevSlide == null){
            prevSlide = albumsElements[albumsElements.length - 1];
        }

        currentSlide.classList.remove('album__el--focus');
        if(window.matchMedia('(max-width: 991px)').matches){
            currentSlide.classList.remove('album__el--animRightReverse');
            currentSlide.classList.remove('album__el--animLeft');
            prevSlide.classList.add('album__el--animRightReverse');
        }
        prevSlide.classList.add('album__el--focus');

        replaceCurrentFocus();
    }

    function nextSlide(){
        const currentSlide = document.querySelector('.album__el--focus');
        let nextSlide = currentSlide.nextElementSibling;

        if(nextSlide == null){
            nextSlide = albumsElements[0];
        }

        if(window.matchMedia('(max-width: 991px)').matches){
            currentSlide.classList.remove('album__el--animRightReverse');
            currentSlide.classList.remove('album__el--animLeft');
            nextSlide.classList.add('album__el--animLeft');
        }

        currentSlide.classList.remove('album__el--focus');
        
        nextSlide.classList.add('album__el--focus');

        replaceCurrentFocus();
    }

    function replaceCurrentFocus(){
        let countFocus = 0;
        for(let albumsElement of albumsElements){
            if(albumsElement.classList.contains('album__el--focus')){
                focus = countFocus;
            }
            countFocus += 1;
        }
        
        for(let slideState of slideStates){
            slideState.classList.remove('album__current--focus');
        }
        slideStates[focus].classList.add('album__current--focus')
    }

    
    function removeFocus(){
        for(let albumsElement of albumsElements){
            if (albumsElement.classList.contains('album__el--focus')){
                albumsElement.classList.remove('album__el--focus');
            }
        }
    }

    // Anim Slider

    gsap.fromTo('.album__el', {
        opacity: 0,
        y: -100
    },
    {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: 'power2',
        scrollTrigger: {
            trigger: '.album',
            start: 'top 80%'
        },
        clearProps: "scale, translate, opacity"
    })

    
}


// Audio

const songs = document.querySelectorAll('.audio');

if(songs){
    for(let playBtn of playBtns){
        playBtn.addEventListener('click', () => {
            
            const audio = playBtn.firstElementChild;
    
            if(audio.paused){
                resetAudio();
                audio.play();
            }else{
                audio.pause();
            }
    
            playBtn.classList.toggle('player--play');
        })
    }

    function resetAudio(){
        for(let playBtn of playBtns){
            playBtn.firstElementChild.pause();
            playBtn.classList.remove('player--play');
        }
    }
    
}

// Animations

const contents = document.querySelectorAll('.content');
if(contents){
    for (let content of contents){
        gsap.from(content, {
            x: -20,
            opacity: 0,
            duration: 0.3,
            scrollTrigger: {
                trigger: content,
                start: 'top 80%'
            }
        })
    }    
}

const artist = document.querySelector('.artist');
if(artist){
    gsap.fromTo('.artist', {
        opacity: 0,
        y: -100
    },
    {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.artist',
            start: 'top 80%'
        },
        clearProps: "scale,left"
    })
}
