import { Router } from 'express';
import LibraryRouter from './library';
import AdminRouter from './admin';
import MediaRouter from './media';

const apiRouter = Router();

apiRouter.use('/library', LibraryRouter);
apiRouter.use('/admin', AdminRouter);
apiRouter.use('/media', MediaRouter);

export default apiRouter;
