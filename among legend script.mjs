
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongodb from 'mongodb';
import { setInterval } from 'timers/promises';
import { readdir } from 'fs';
import { promisify } from 'util';
const { MongoClient } = mongodb;

let count=0
let user = {};

let identityup=['imposteur','serpentin','superhero','doubleface','roméo','droide']

global.T1 = []
global.T0 = []

 

let mace = '';
let lunch = false;


// Obtenir le répertoire du fichier courant
const __dirname = dirname(fileURLToPath(import.meta.url));

// Créer une instance de l'application Express
const app = express();

// Créer un serveur HTTP basé sur l'application Express
const server = createServer(app);

// Initialiser Socket.io pour le serveur HTTP
const io = new Server(server);

// Servir les fichiers statiques de l'application (y compris index.html)
app.use(express.static(__dirname));

// Définir une route pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/among legend.html");  
});

let collec = '';
const url = 'mongodb+srv://tureti:db7dm8mf@cluster0.tvkiecu.mongodb.net/votreBaseDeDonnées?retryWrites=true&w=majority';

async function connectWithMongoClient() {
    const client = new MongoClient(url);
    await client.connect();
    const database = client.db('votreBaseDeDonnées');
    collec = database.collection('user');
}

io.on('connection', (socket) => {
    connectWithMongoClient();
    socket.point=0
    socket.imparti=0
    socket.IDroide=''

    socket.on('disconnect', () => {});

    socket.on("disconnecting", () => {
        if (collec !== null && collec !== undefined) {
            disconnecting(socket);
        }
    });

    socket.on('pseudo', async (n) => {
      
        socket.pseudo = n;
        user[socket.id] = n;
       
           if (lunch === true) {
           soitajour(socket)
           reco(socket,n);
           
        }
                 
        else{
         
            await mongouser(n)
            soitajour(socket)

        }
       infosave(socket.pseudo,'id',socket.id);
        
        
        
    });

    socket.on('ve', () => {
        let ndpe = Object.keys(user).length;
        socket.emit('val', ndpe < 10);
    });

    socket.on('t12', async (h,reco) => {
       
        let mace = await collec.countDocuments({ 'team':`T${h}` });

        if (mace< 2 ||reco==="reco") {
            t12(socket, h);
        }
        infosave(socket.pseudo, 'team', `T${h}`);
    });

    socket.on('vt',async (four,reco) => {
        let roomSize = await collec.countDocuments({ 'team':`T${four}` });
       

        if (roomSize<2 || reco==="reco"){
            socket.emit('val2', true);
        }
        else{
            socket.emit('val2', false);
        }
       
    });

    socket.on('nb',async () => {
        let T1 = await collec.countDocuments({ 'team':`T1` });
        let T0 = await collec.countDocuments({ 'team':`T0` });
        if (T1 === 2 && T0===2) {
            socket.emit('enough', true);
        }
    });

    socket.on('qt', (t, nplace, su,th) => {
        if (t === 'T1') {
            infosave(socket.pseudo,'team',`T1`)
            //infodel(socket.pseudo,'team')
          
        } else {
            infosave(socket.pseudo,'team',`T0`)
            //infodel(socket.pseudo,'team')
        }
        infosave(socket.pseudo, 'teamate', nplace);
        infosave(socket.pseudo, 'supprimer', su);
        infosave("biencommun1", 't', th+1);
    });

    socket.on('saveteamate', (l, s) => {
        infosave(socket.pseudo, 'teamate', `t${l}${s}`);
        infosave(socket.pseudo, 'supprimer', `teamate${l}${s}`);
     
        infosave('biencommun1', 't', s + 1);
        infosave('biencommun0', 't', s + 1);
    });

    socket.on('recup', () => {
        pecor(socket);
    });

    socket.on('conn', (h) => {
        
        connt(socket,h);
        
    });

    socket.on('giverole',async (t) => {
       
        lunch = t;
        let ni = [];
        let identity = ['droide', 'doubleface'];
        
        for (let b = 0; b < 2; b++) {
            let i = 2;
            let k = 0;
            while (identity.length !== 0) {
                let choix = Math.floor(Math.random() * identity.length);
                let nv = identity.splice(choix, 1);
                ni.push(nv[0]);
                i--;
            }
            
            global[`T${b}`]=await collec.find({'team':`T${b}`}).toArray()
            let idt=global[`T${b}`].map(dpc=>dpc.id)
           
           

            for (const userid of idt){
                infosaveid(userid, 'role', ni[k]);
                infosaveid(userid,'point',0)
                infosaveid(userid,'ordre',[])
                
                if (k !== 2 && userid !== socket.id) {
                    socket.to(userid).emit('message', ni[k],b);
                    
                } else {
                    socket.emit('message', ni[k],b);
                }
                //global[ni[k]].add(userid);
                
                k++;
            };
        }
        
    });

    

    socket.on('racket', (f, a1, a2, a3, a4, a5, a6, a7) => {
        io.emit('falldo', f, a1, a2, a3, a4, a5, a6, a7);
    });

    socket.on('resolue', (h, opt, opt2, t) => {
        socket.emit('cfait', h, t);
        infosave('biencommun1', 'table', opt);
        infosave('biencommun0', 'table', opt2);
    });

    socket.on('disconnecting2', (l1, l0) => {
        infosave('biencommun1', 'table', l1);
        infosave('biencommun0', 'table', l0);
        console.log('salam')
        io.emit('maj', l1, l0);
    });

    socket.on('failure', () => {
        disconnecting(socket);
    });

    socket.on('omaewa', (v1, v2, v3, v4) => {});

    socket.on('biencommun', (un, zero) => {
        infosave("biencommun1",'table', un);
        infosave( "biencommun0",'table', zero);
        socket.emit('artemis', true);
    });

    socket.on('bjr', (t,x) => {
        console.log(t+'ou est le messsage')
        console.log(x)
    });

    socket.on('jt',async(h)=>{
    
        socket.emit('gh',global[`T${h}`])
    })
    socket.on("elu",async(p,id,h)=>{
        
    
     
        let attribution= await collec.findOne({ id:global[`T${h}`][p].id});
        

        if (attribution.role===identityup[id]){
          
            socket.point+=1
            infosave(socket.pseudo,'point',socket.point)
        }
        count++
       
        if(count===8){
           
           let chacal =await collec.find({point:{$exists:true}}).sort({point:-1}).toArray()

        
            io.emit('resultat',chacal)
        }
        
    })
    socket.on('savetab',(disco,t)=>{
        infosave(socket.pseudo,disco,t)
    })

    socket.on('clear',async()=>{
        
       const execution= await collec.deleteMany({});
        T1.length=0
        T0.length=0
        
    })
    socket.on('bard',(shop)=>{
        droideaudio(shop,socket)
        
    })
    socket.on('sendall', async() => {
        mongouser('crap')
        await infosave('crap','function','testinglimit')
        chrono(0,socket)
        console.log('chrono')
    });
    socket.on('sendall2',async()=>{
        stopTimer(socket)
    })

  /*  socket.on('gros',()=>{
        console.log('gros')
        chrono(0,socket)
    })*/
});

async function testons() {
    let testing = await collec.findOne({ skip: 'trahison' });
    return testing;
}

async function pecor(socket) {
    let pecor = await collec.findOne({ pseudo: socket.pseudo });
    let mecor = await collec.findOne({ pseudo: 'biencommun1' });

    if (pecor.teamate !== undefined) {
        socket.emit('recap', pecor.teamate, pecor.supprimer, mecor.t);
    }
}

async function infosave(pseudo, prop, info) {
    if (collec !== undefined) {
        await collec.updateOne({ pseudo: pseudo }, { $set: { [prop]: info } });
    }
}
async function infosaveid(id, prop, info) {
    if (collec !== undefined) {
        await collec.updateOne({ id: id }, { $set: { [prop]: info } });
    }
}


async function mongouser(pseudo) {
    let us = { pseudo: pseudo };
    await collec.insertOne(us);
}



async function reco(socket, n) {
  
    let decor = await collec.findOne({ pseudo: n });
  
        if (decor!==null){
    if (decor.role !== undefined ) {
        socket.emit(decor.role,decor.ordre);
    }
    if (decor.team !== undefined ) {
       
        socket.emit(decor.team)
      
    }
    if(decor.disco!==undefined){

        socket.emit('avance',decor.disco,'dab')

    }// faut que je differncie quand c double face et quand c droide
    if (decor.lapin!==undefined)
        socket.emit('lelouch',decor.lapi,'listordre')
    let tempsrestant=decor.tn-decor.temps
    
    console.log(tempsrestant+'tempsrestant')
        globalThis[decor.role]([decor],socket,0,tempsrestant,decor.ordre[-1])
    {

    }
}
}

async function disconnecting(socket) {
    let supragrand = await collec.findOne({ pseudo: socket.pseudo });
//s'il y a quelque chose il supprime
    if (supragrand !== null) {
        if (supragrand.team !== undefined ) {
           // global[supragrand.team].delete(socket.pseudo);
           if (lunch===false){
            
            delete supragrand.team
           }
        }

        if (supragrand.role !== undefined && supragrand.role !== null) {
           // global[supragrand.role].delete(socket.pseudo);
           if(lunch===false){
            delete supragrand.role
           }
        } 
        else {
            //quand on se deconnecte je supprime ton profil
            await collec.deleteOne({ pseudo: socket.pseudo });
        }
        //ne remet plus jamais en doute artemis ce ne bloquera jamais 
        await new Promise((resolve) => {
            socket.on('artemis', (t) => {
                resolve(t);
            });
        });
    }
    
    socket.emit('stomp')
    console.log(socket.imparti)
    clearTimeout(socket.IDroide)
    infosave(socket.pseudo,'temps',socket.imparti)
       /* await new Promise((resolve)=>{
            socket.on('tictac',(p)=>{
                console.log('dksfqjslkdfjsdqlkfsjlk')
                resolve(p)
            })
        })*/
       
}

async function connt(socket,h) {
   
    let team= await collec.findOne({pseudo:socket.pseudo})

    
   //deja dans une equipe
    if (team!==null && team.team!==undefined) {
        socket.emit('cringe', true, socket.pseudo);
    }
    //trouve pas de team 
    else {
       
        socket.emit('cringe', false, socket.pseudo);
    }
   
}

async function soitajour(socket) {  
   
    let cecor = await collec.findOne({ pseudo: 'biencommun1' });
    let secor = await collec.findOne({ pseudo: 'biencommun0' });
    

    if (cecor !== undefined || secor !== undefined) {
        if (cecor !== null || secor !== null) {
            socket.emit('maj', cecor.table, secor.table);
        } 
        else {
        
            mongouser('biencommun0');
            await mongouser('biencommun1');  
           await infosave('biencommun1', 't', 0);
        }
    }
}

async function t12(socket, h) {
    let pog = await collec.findOne({ pseudo: 'biencommun1' });
    if (collec.findOne({pseudo:socket.pseudo})!==null){
    socket.emit('rej', socket.pseudo, pog.t);
    infosave(socket.pseudo, 'team', `T${h}`);
   // global[mace].add(socket.pseudo);
    }
}
hoho()
async function hoho(){
    const readdirAsync = promisify(readdir);
    const files=await readdirAsync('\ordre')
    tabaudio0=files.slice()
    tabaudio1=files.slice()
  

}

global.tabaudio0 = '';
global.tabaudio1 = '';
global.doubleface0=['tu dois gagner','tu dois perdre']
global.doubleface1=['tu dois gagner','tu dois perdre']
global.IDroide0=''
global.IDroide1=''
let stop=true
global.Idouble0=''
global.Idouble1=''


globalThis.doubleface=async function doubleface(facy,socket,k){
  
    let timer2=await (Math.floor(Math.random() * 4.99)+1)*30000
    let choisi = Math.floor(Math.random() * ((global[`doubleface${k}`].length)+0.99));
    let nv = global[`doubleface${k}`][choisi]
    
        collec.updateOne({pseudo:facy[k].pseudo}, {$push: { ordre: nv} });
        //ecrire l ordre plus dit l ordre  
        if (facy[k].pseudo!==socket.pseudo){
        //socket.to(facy[k].pseudo).emit('mele',nv)
        
        }
        else{
          //  socket.emit('mele',nv)
        }
       
        global[`Idouble${k}`]=setTimeout(()=>doubleface(facy,socket,k), timer2);
    }
    


  /*  function stopTimer(socket) {
        clearTimeout(socket.trynda);
        console.log('timerstopper')
      //  socket.emit('tictac',true)
      
      }*/  

function chrono(k,socket){
   
    socket.imparti+=k
    console.log(socket.imparti)
    socket.emit('rep',true)
    socket.trynda=setTimeout(() => {
        chrono(2000,socket)
}, 1000);
}
globalThis.droide=async function droide(lebadre,socket,k,tr,ordre){
    //arrete le chronometre quand sotp false cad quand on appuie sur arreter 
    if(socket.pseudo!==lebadre[k].pseudo){
        console.log('voici le nom en questio'+lebadre[k].pseudo)
        socket.to(lebadre[k].id).emit('stomp')
        }
        else{
            socket.emit('stomp')
        }
       
        
    if (stop===true){
   
     if (tr!==0){
        console.log(tr)
        console.log('tr est different de 0')
        socket.emit('gros')
        infosave(lebadre[k].pseudo,'tn',tr)
        await setTimeout(()=>{
            droide(lebadre,socket,k,0,ordre)}, tr);
        
     }
       else{ 
        if(ordre===null || ordre===undefined){
            var timer=await (Math.floor((Math.random() * 4.99))+1)*30000
    
        let choisi = Math.floor(Math.random() * (global[`tabaudio${k}`].length-0,1));
        console.log(timer)
        console.log('tttttttttttttttttttttttttttt')
        var mv = global[`tabaudio${k}`].splice(choisi, 1);
        infosave(lebadre[k].pseudo,'tn',timer)
        collec.updateOne({pseudo:lebadre[k].pseudo}, {$push: { ordre: mv} });

        } 
        else {
            var mv=ordre
            
        }
        
        if (lebadre[k].pseudo!==socket.pseudo){
           console.log(mv)
        socket.to(lebadre[k].id).emit('mele',mv.toString())
        socket.to(lebadre[k].id).emit('gros')
        

        
        }
        else{
            socket.emit('mele',mv.toString())
            socket.emit('gros')
           
        }
        socket.IDroide=setTimeout(()=>
            droide(lebadre,socket,k,0,null), timer);

    } 
}

}

async function droideaudio(shop,socket) {
  

    if(shop===false){
        stop=false
        clearTimeout(IDroide0)
        clearTimeout(IDroide1)
        clearTimeout(socket.IDroide)
        clearTimeout(Idouble0)
        clearTimeout(Idouble1)

    }
    else{
  
   
    let lebadre=await collec.find({'role':'droide'}).toArray()
    let facy=await collec.find({'role':'doubleface'}).toArray()
    let romeo=await collec.find({'role':'romeo'}).toArray()
    
    
    
 //execution immediat
 if(facy!==null ){
 
 
    doubleface(facy,socket,1)
    doubleface(facy,socket,0)
 }
 if(lebadre!==null ){
    droide(lebadre,socket,1,0)
    droide(lebadre,socket,0,0)

 }
 if(romeo!==null && romeo.pseudo!==undefined){
    for(let k=0;k<2;k++){
        let juliette=await collec.find({'team':romeo[k].team}).toArray()
        let jul=Math.floor(Math.random() * 4.99)
        socket.to(romeo[k].pseudo).emit('mele',`voici ta juliette ${juliette[jul].pseudo} j'espère que tu heureux que ce soit cette personne`)
        
    }
    
 } 
}
    
}

globalThis.testinglimit=function testinglimit(){
    console.log('yo connard')
    }
    


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {});
