import {Schema, Document, model} from "mongoose";
import { tipoLibro } from "./libro.dto";
import { timestamp } from "rxjs";
import mongoose from "mongoose";
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export const LibroSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: Object.values(tipoLibro),
      required: true,
    },
    contenidoLibro:{
      type: Buffer,
      required: true,
    },
  },
  {timestamps: true}
);

export interface ILibro extends Document{
  tipo: tipoLibro;
  contenidoLibro: Buffer;
  createdAt: Date;
  updateAt: Date;
  
}
export  const libroModel=model<ILibro>("Libro",LibroSchema);