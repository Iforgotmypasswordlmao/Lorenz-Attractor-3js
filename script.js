import { Lorenz } from "./lorenz.js";
import * as THREE from 'three';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.set(500, 0, 0)
const renderer = new THREE.WebGLRenderer()
const ui = new GUI()
const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild( renderer.domElement )

let position = { 'x': 0.1, 'y': 0.1, 'z': 0.1 }
let variables = { 'sigma': 10, 'rho': 28, 'beta': 8/3 }
let systemControls = { 'deltaTime': 0.01, 'run': function() {run()}, 'scale': 5 }

const positionFolder = ui.addFolder('Position')
positionFolder.add(position, 'x')
positionFolder.add(position, 'y')
positionFolder.add(position, 'z')

const variablesFolder = ui.addFolder('Variables')
variablesFolder.add(variables, 'sigma')
variablesFolder.add(variables, 'rho')
variablesFolder.add(variables, 'beta')

const systemControlsFolder = ui.addFolder("System")
systemControlsFolder.add(systemControls, 'scale')
systemControlsFolder.add(systemControls, 'deltaTime')
systemControlsFolder.add(systemControls, 'run')

let lorenzSystem, 
    maxPoints, 
    drawCount, 
    line, 
    id
let stop = false

function init()
{
    scene.remove( line );
    lorenzSystem = new Lorenz(variables, position)
    maxPoints = 100/systemControls['deltaTime']
    const geometry = new THREE.BufferGeometry()
    const positionList = new Float32Array( maxPoints * 3)
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positionList, 3 ) );
    drawCount = 2;
    geometry.setDrawRange( 0, drawCount );
    const material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 100 } );
    line = new THREE.Line( geometry,  material );
    scene.add( line );
}

function updateLorenzPosition()
{
    const positions = line.geometry.attributes.position.array;
    const scale = systemControls['scale']

    for (let j = 1; j < maxPoints + 1; j++)
    {  
        positions[ j*3 - 3 ] = isNaN(lorenzSystem.position['x']) ? 0 : lorenzSystem.position['x']*scale;
	positions[ j*3 - 2 ] = isNaN(lorenzSystem.position['y']) ? 0 : lorenzSystem.position['y']*scale;
	positions[ j*3 - 1 ] = isNaN(lorenzSystem.position['z']) ? 0 : lorenzSystem.position['z']*scale;
        lorenzSystem.updateVelocity();
        lorenzSystem.updatePosition(systemControls['deltaTime']);
        
    }
    line.geometry.attributes.position.needsUpdate = true;
    
}

function animate()
{
    id = requestAnimationFrame( animate );
    drawCount = ( drawCount + 1 );
    line.geometry.setDrawRange( 0, drawCount )
    if ( drawCount >= maxPoints )
    {
        cancelAnimationFrame(id)
    }
    renderer.render( scene, camera )
}

function run()
{
    if (stop)
    {
        renderer.clear()
        init()
        updateLorenzPosition()
        animate()
    }
    else
    {
        cancelAnimationFrame(id)
    }
    stop = !stop
}

function main()
{
    init()
    updateLorenzPosition()
    animate()
}

window.onload = () => {
    main()
}
