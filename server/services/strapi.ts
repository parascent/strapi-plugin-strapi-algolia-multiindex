import { Common, Strapi } from '@strapi/strapi';
import { SearchIndex } from 'algoliasearch';
import { HookEvent } from '../../utils/event';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ strapi }: { strapi: Strapi }) => ({
  getStrapiObject: async (
    event: HookEvent,
    populate: any,
    hideFields: string[]
  ) => {
    const strapiAlgolia = strapi.plugin('strapi-algolia');
    const utilsService = strapiAlgolia.service('utils');

    const { model } = event;
    const modelUid = model.uid as Common.UID.ContentType;
    const entryId = utilsService.getEntryId(event);

    if (!entryId) {
      throw new Error(`No entry id found in event.`);
    }

    const strapiObject = await strapi.entityService?.findOne(
      modelUid,
      entryId,
      { populate }
    );

    if (!strapiObject) {
      throw new Error(
        `No entry found for ${modelUid} with ID ${entryId}`
      );
    }

    return utilsService.filterProperties(strapiObject, hideFields);
  },
  getStrapiObjectWithoutFilters: async (
    event: HookEvent,
    populate: any,
  ) => {
    const strapiAlgolia = strapi.plugin('strapi-algolia');
    const utilsService = strapiAlgolia.service('utils');

    const { model } = event;
    const modelUid = model.uid as Common.UID.ContentType;
    const entryId = utilsService.getEntryId(event);

    if (!entryId) {
      throw new Error(`No entry id found in event.`);
    }

    const strapiObject = await strapi.entityService?.findOne(
      modelUid,
      entryId,
      { populate }
    );

    if (!strapiObject) {
      throw new Error(
        `No entry found for ${modelUid} with ID ${entryId}`
      );
    }

    return strapiObject
  },
  afterUpdateAndCreate: async (
    _events: any[],
    populate: any,
    hideFields: string[],
    transformToBooleanFields: string[],
    idPrefix: string,
    algoliaIndex: SearchIndex
  ) => {
    const strapiAlgolia = strapi.plugin('strapi-algolia');
    const algoliaService = strapiAlgolia.service('algolia');
    const strapiService = strapiAlgolia.service('strapi');
    const utilsService = strapiAlgolia.service('utils');

    const objectsToSave: any[] = [];
    const objectsIdsToDelete: string[] = [];
    const events = _events as HookEvent[];
    const indexExist = await algoliaIndex.exists();

    for (const event of events) {
      try {
        const entryId = `${idPrefix}${utilsService.getEntryId(
          event
        )}`;
        let strapiObject = await strapiService.getStrapiObjectWithoutFilters(
          event,
          populate
        );

        if (strapiObject.publishedAt === null) {
          if (indexExist) {
            objectsIdsToDelete.push(entryId);
          }
        } else if (strapiObject.publishedAt !== null) {
          strapiObject = utilsService.filterProperties(strapiObject, hideFields)
          const entryId = strapiObject.id;
          const entryIdWithPrefix = `${idPrefix}${entryId}`;
          let objectToSave = {
            objectID: entryIdWithPrefix,
            ...strapiObject,
          }
          if(idPrefix && idPrefix != ''){
            objectToSave['collection'] = idPrefix
          }
          objectsToSave.push(objectToSave);
        }
      } catch (error) {
        console.error(
          `Error while updating Algolia index: ${JSON.stringify(
            error
          )}`
        );
      }
    }

    await algoliaService.createOrDeleteObjects(
      objectsToSave,
      objectsIdsToDelete,
      algoliaIndex,
      transformToBooleanFields
    );
  },
  afterUpdateAndCreateAlreadyPopulate: async (
    articles: any[],
    idPrefix: string,
    algoliaIndex: SearchIndex,
    transformToBooleanFields: string[] = []
  ) => {
    const strapiAlgolia = strapi.plugin('strapi-algolia');
    const algoliaService = strapiAlgolia.service('algolia');

    const objectsToSave: any[] = [];
    const objectsIdsToDelete: string[] = [];
    const indexExist = await algoliaIndex.exists();

    for (const article of articles) {
      try {
        const entryId = article.id;
        const entryIdWithPrefix = `${idPrefix}${entryId}`;
        if (article.publishedAt === null) {
          if (indexExist) {
            objectsIdsToDelete.push(entryIdWithPrefix);
          }
        }
        else if (article.publishedAt !== null) {
          let objectToSave = {
            objectID: entryIdWithPrefix,
            ...article,
          }
          if(idPrefix && idPrefix != ''){
            objectToSave['collection'] = idPrefix
          }
          objectsToSave.push(objectToSave);
        }
      } catch (error) {
        console.error(
          `Error while updating Algolia index: ${JSON.stringify(
            error
          )}`
        );
      }
    }

    await algoliaService.createOrDeleteObjects(
      objectsToSave,
      objectsIdsToDelete,
      algoliaIndex,
      transformToBooleanFields
    );
  },
  afterDeleteOneOrMany: async (
    _event: any,
    idPrefix: string,
    algoliaIndex: SearchIndex,
    many: boolean
  ) => {
    try {
      const event = _event as HookEvent;
      const strapiIds = many
        ? event?.params?.where?.['$and'][0]?.id['$in']
        : [event.params.where.id];
      const objectIDs = strapiIds.map(
        (id: string) => `${idPrefix}${id}`
      );

      await algoliaIndex.deleteObjects(objectIDs);
    } catch (error) {
      console.error(
        `Error while deleting object(s) from Algolia index: ${error}`
      );
    }
  },
});
