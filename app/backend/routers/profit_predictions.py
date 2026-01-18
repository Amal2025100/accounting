import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.profit_predictions import Profit_predictionsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/profit_predictions", tags=["profit_predictions"])


# ---------- Pydantic Schemas ----------
class Profit_predictionsData(BaseModel):
    """Entity data schema (for create/update)"""
    prediction_date: date
    predicted_profit: float
    confidence: float


class Profit_predictionsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    prediction_date: Optional[date] = None
    predicted_profit: Optional[float] = None
    confidence: Optional[float] = None


class Profit_predictionsResponse(BaseModel):
    """Entity response schema"""
    id: int
    prediction_date: date
    predicted_profit: float
    confidence: float

    class Config:
        from_attributes = True


class Profit_predictionsListResponse(BaseModel):
    """List response schema"""
    items: List[Profit_predictionsResponse]
    total: int
    skip: int
    limit: int


class Profit_predictionsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Profit_predictionsData]


class Profit_predictionsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Profit_predictionsUpdateData


class Profit_predictionsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Profit_predictionsBatchUpdateItem]


class Profit_predictionsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Profit_predictionsListResponse)
async def query_profit_predictionss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query profit_predictionss with filtering, sorting, and pagination"""
    logger.debug(f"Querying profit_predictionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Profit_predictionsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} profit_predictionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying profit_predictionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Profit_predictionsListResponse)
async def query_profit_predictionss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query profit_predictionss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying profit_predictionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Profit_predictionsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} profit_predictionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying profit_predictionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Profit_predictionsResponse)
async def get_profit_predictions(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single profit_predictions by ID"""
    logger.debug(f"Fetching profit_predictions with id: {id}, fields={fields}")
    
    service = Profit_predictionsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Profit_predictions with id {id} not found")
            raise HTTPException(status_code=404, detail="Profit_predictions not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profit_predictions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Profit_predictionsResponse, status_code=201)
async def create_profit_predictions(
    data: Profit_predictionsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new profit_predictions"""
    logger.debug(f"Creating new profit_predictions with data: {data}")
    
    service = Profit_predictionsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create profit_predictions")
        
        logger.info(f"Profit_predictions created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating profit_predictions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating profit_predictions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Profit_predictionsResponse], status_code=201)
async def create_profit_predictionss_batch(
    request: Profit_predictionsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple profit_predictionss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} profit_predictionss")
    
    service = Profit_predictionsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} profit_predictionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Profit_predictionsResponse])
async def update_profit_predictionss_batch(
    request: Profit_predictionsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple profit_predictionss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} profit_predictionss")
    
    service = Profit_predictionsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} profit_predictionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Profit_predictionsResponse)
async def update_profit_predictions(
    id: int,
    data: Profit_predictionsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing profit_predictions"""
    logger.debug(f"Updating profit_predictions {id} with data: {data}")

    service = Profit_predictionsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Profit_predictions with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Profit_predictions not found")
        
        logger.info(f"Profit_predictions {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating profit_predictions {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating profit_predictions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_profit_predictionss_batch(
    request: Profit_predictionsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple profit_predictionss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} profit_predictionss")
    
    service = Profit_predictionsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} profit_predictionss successfully")
        return {"message": f"Successfully deleted {deleted_count} profit_predictionss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_profit_predictions(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single profit_predictions by ID"""
    logger.debug(f"Deleting profit_predictions with id: {id}")
    
    service = Profit_predictionsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Profit_predictions with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Profit_predictions not found")
        
        logger.info(f"Profit_predictions {id} deleted successfully")
        return {"message": "Profit_predictions deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting profit_predictions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")