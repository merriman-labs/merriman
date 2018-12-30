import { Router } from 'express';
import LibraryRouter from './library';
import AdminRouter from './admin';
import MediaRouter from './media';
import SearchRouter from './search';

const apiRouter = Router();

apiRouter.use('/admin', AdminRouter);
apiRouter.use('/library', LibraryRouter);
apiRouter.use('/search', SearchRouter);
apiRouter.use('/media', MediaRouter);

export default apiRouter;
