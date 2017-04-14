'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveAlbum(req, res){
   var album = new Album();
   var params = req.body;

   album.title        = params.title;
   album.description  = params.description;
   album.year         = params.year;
   album.image        = 'null';
   album.artist        = params.artist;

   album.save((err, albumStored) => {
      if (err) {
         res.status(500).send({ message: "Error en el servidor" });
      } else {
         if (!albumStored) {
            res.status(404).send({ message: "El album no ha sido guardado" });
         } else {
            res.status(200).send({ album: albumStored });
         }
      }
   });
}

function updateAlbum(req, res){
   var albumId = req.params.id;
   var update = req.body;

   Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
      if (err) {
         res.status(500).send({ message: "Error en el servidor" });
      } else {
         if (!albumUpdated) {
            res.status(404).send({ message: "No se ha actualizado el album" });
         } else {
            res.status(200).send({ message: albumUpdated });
         }
      }
   });
}

function getAlbums(req, res){
   var artistId = req.params.artist;

   if (!artistId) {
      //sacar todos los albums
      var find = Album.find({}).sort('title');
   } else {
      //sacar los albums de un artista concreto
      var find = Album.find({artist: artistId}).sort('year');
   }
   find.populate({path: 'artist'}).exec((err, albums) => {
      if (err) {
         res.status(500).send({ message: "Error en la peticion" });
      } else {
         if (!albums) {
            res.status(404).send({ message: "No hay Albums" });
         } else {
            res.status(202).send({ albums });
         }
      }
   });
}

function deleteAlbum(req, res){
   var albumId = req.params.id;

   Album.findByIdAndRemove( albumId, (err, albumRemoved) => {
      if (err) {
         res.status(500).send({ message: "Error al eliminar el album" });
      } else {
         if (!albumRemoved) {
            res.status(404).send({ message: "El album no ha sido elimando" });
         } else {
            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
               if (err) {
                  res.status(500).send({ message: "Error al eliminar la canción" });
               } else {
                  if (!songRemoved) {
                     res.status(404).send({ message: "La canción no ha sido elimando" });
                  } else {
                     res.status(202).send({ album: albumRemoved });
                  }
               }
            });
         }
      }
   });
}

function uploadImage(req, res){
   var albumId = req.params.id;
   var file_name = 'No subio';
   
   if (req.files) {
      var file_path  = req.files.image.path;
      var file_split = file_path.split('\/');
      var file_name  = file_split[2];

      var ext_split = file_name.split('\.');
      var file_ext  = ext_split[1];

      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ) {
         Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
            if (!albumId) {
               res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
               res.status(200).send({ album: albumUpdated });
            }
         });
      } else {
         res.status(200).send({ message: 'Extension no es correcta' });
      }
   } else {
      res.status(200).send({ message: 'No has subido ninguna imagen' });
   }
}

function getImageFile(req, res){
   var imageFile = req.params.imageFile;
   var path_file = './uploads/albums/' + imageFile;

   fs.exists(path_file, function(exists){
      if (exists) {
         res.sendFile(path.resolve(path_file));
      } else {
         res.status(200).send({ message: 'No existe la imagen' });
      }
   });
}

function getAlbum(req, res){
   var albumId = req.params.id;

   Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
      if (err) {
         res.status(500).send({ message: "Error en la peticion" });
      } else {
         if (!album) {
            res.status(404).send({ message: "El artista no existe" });
         } else {
            res.status(200).send({ album });
         }
      }
   });
}

module.exports = {
   getAlbum,
   saveAlbum,
   getAlbums,
   updateAlbum,
   deleteAlbum,
   uploadImage,
   getImageFile
}
