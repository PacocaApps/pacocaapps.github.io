
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.physicallyCorrectLights = true;
var controls = new OrbitControls( camera, renderer.domElement );

camera.lookAt (new THREE.Vector3(0,0,0));


var SunMassConstant = 1.3274745*100000000000000000000 ;



const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.PointLight(color, intensity);
light.power = 80;
light.decay = 0;
light.distance = Infinity;
light.position.set(0, 0, 100);
scene.add(light);



const sphereRadius = 0.2;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
const sphereMat = new THREE.MeshStandardMaterial({color: '#CA8'});
const Sun = new THREE.Mesh(sphereGeo, sphereMat);
// mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
scene.add(Sun);







camera.position.z = 5;





class OrbitalObject{
    constructor(a,b,color,size){
        this.a = a;
        this.b = b;
        this.color = color;
        
        this.sphereRadius = size;
        this.sphereWidthDivisions = 32;
        this.sphereHeightDivisions = 16;
        this.sphereGeo = new THREE.SphereGeometry(this.sphereRadius, this.sphereWidthDivisions, this.sphereHeightDivisions);
        this.sphereMat = new THREE.MeshStandardMaterial({color: this.color});
        this.Mesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);
        this.Mesh.position.set(0, 2, 0);
        this.y = -this.b;
        this.x = -this.a;
this.positionalarg = 1;
        scene.add(this.Mesh);

    }
    OrbitalMechanics(){
       this.w = math.sqrt(Math.pow(this.a,3)/SunMassConstant)

       this.x += this.positionalarg*this.w*100;

        if(this.x>this.a/1){
             this.positionalarg = -1;

        }else if(this.x < -this.a){
            this.positionalarg = 1;

        }

        var prevy =Math.pow(this.x,2)/Math.pow(this.a,2)
        this.y = this.b*math.sqrt(1 - prevy)

        this.Mesh.position.x = this.x/100000000;
        this.Mesh.position.y = this.positionalarg*this.y/100000000;
    }     
    
}


var earth = new OrbitalObject(149597887.5,149576999.826,"#CF2",0.05);

var Venus = new OrbitalObject(449597887.5,249576999.826,"A32",0.05);






function animate() {
	requestAnimationFrame( animate );
earth.OrbitalMechanics();
Venus.OrbitalMechanics();
	renderer.render( scene, camera );
}
animate();
