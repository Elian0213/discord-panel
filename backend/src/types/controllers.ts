// eslint-disable-next-line no-unused-vars
import { Router } from 'express';

export interface IController {
  getRouter(): Router;
}
