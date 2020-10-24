import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailability from '@modules/appointments/infra/http/controllers/ProviderMonthAvailability';
import ProviderDayAvailability from '@modules/appointments/infra/http/controllers/ProviderDayAvailability';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailability = new ProviderMonthAvailability();
const providerDayAvailability = new ProviderDayAvailability();

providersRouter.use(ensureAuthenticated);
providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:id/month-availability',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerMonthAvailability.index,
);
providersRouter.get(
    '/:id/day-availability',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerDayAvailability.index,
);

export default providersRouter;
