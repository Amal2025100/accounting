import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.sales_forecasts import Sales_forecastsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/sales_forecasts", tags=["sales_forecasts"])


# ---------- Pydantic Schemas ----------
class Sales_forecastsData(BaseModel):
    """Entity data schema (for create/update)"""
    forecast_date: date
    predicted_value: float
    confidence: float


class Sales_forecastsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    forecast_date: Optional[date] = None
    predicted_value: Optional[float] = None
    confidence: Optional[float] = None


class Sales_forecastsResponse(BaseModel):
    """Entity response schema"""
    id: int
    forecast_date: date
    predicted_value: float
    confidence: float

    class Config:
        from_attributes = True


class Sales_forecastsListResponse(BaseModel):
    """List response schema"""
    items: List[Sales_forecastsResponse]
    total: int
    skip: int
    limit: int


class Sales_forecastsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Sales_forecastsData]


class Sales_forecastsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Sales_forecastsUpdateData


class Sales_forecastsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Sales_forecastsBatchUpdateItem]


class Sales_forecastsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Sales_forecastsListResponse)
async def query_sales_forecastss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query sales_forecastss with filtering, sorting, and pagination"""
    logger.debug(f"Querying sales_forecastss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Sales_forecastsService(db)
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
        logger.debug(f"Found {result['total']} sales_forecastss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying sales_forecastss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Sales_forecastsListResponse)
async def query_sales_forecastss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query sales_forecastss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying sales_forecastss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Sales_forecastsService(db)
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
        logger.debug(f"Found {result['total']} sales_forecastss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying sales_forecastss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Sales_forecastsResponse)
async def get_sales_forecasts(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single sales_forecasts by ID"""
    logger.debug(f"Fetching sales_forecasts with id: {id}, fields={fields}")
    
    service = Sales_forecastsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Sales_forecasts with id {id} not found")
            raise HTTPException(status_code=404, detail="Sales_forecasts not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sales_forecasts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Sales_forecastsResponse, status_code=201)
async def create_sales_forecasts(
    data: Sales_forecastsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new sales_forecasts"""
    logger.debug(f"Creating new sales_forecasts with data: {data}")
    
    service = Sales_forecastsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create sales_forecasts")
        
        logger.info(f"Sales_forecasts created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating sales_forecasts: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating sales_forecasts: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Sales_forecastsResponse], status_code=201)
async def create_sales_forecastss_batch(
    request: Sales_forecastsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple sales_forecastss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} sales_forecastss")
    
    service = Sales_forecastsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} sales_forecastss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Sales_forecastsResponse])
async def update_sales_forecastss_batch(
    request: Sales_forecastsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple sales_forecastss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} sales_forecastss")
    
    service = Sales_forecastsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} sales_forecastss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Sales_forecastsResponse)
async def update_sales_forecasts(
    id: int,
    data: Sales_forecastsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing sales_forecasts"""
    logger.debug(f"Updating sales_forecasts {id} with data: {data}")

    service = Sales_forecastsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Sales_forecasts with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Sales_forecasts not found")
        
        logger.info(f"Sales_forecasts {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating sales_forecasts {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating sales_forecasts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_sales_forecastss_batch(
    request: Sales_forecastsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple sales_forecastss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} sales_forecastss")
    
    service = Sales_forecastsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} sales_forecastss successfully")
        return {"message": f"Successfully deleted {deleted_count} sales_forecastss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_sales_forecasts(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single sales_forecasts by ID"""
    logger.debug(f"Deleting sales_forecasts with id: {id}")
    
    service = Sales_forecastsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Sales_forecasts with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Sales_forecasts not found")
        
        logger.info(f"Sales_forecasts {id} deleted successfully")
        return {"message": "Sales_forecasts deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting sales_forecasts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")