import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.ai_alerts import Ai_alertsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/ai_alerts", tags=["ai_alerts"])


# ---------- Pydantic Schemas ----------
class Ai_alertsData(BaseModel):
    """Entity data schema (for create/update)"""
    alert_date: datetime
    alert_type: str
    message: str
    risk_score: int


class Ai_alertsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    alert_date: Optional[datetime] = None
    alert_type: Optional[str] = None
    message: Optional[str] = None
    risk_score: Optional[int] = None


class Ai_alertsResponse(BaseModel):
    """Entity response schema"""
    id: int
    alert_date: datetime
    alert_type: str
    message: str
    risk_score: int

    class Config:
        from_attributes = True


class Ai_alertsListResponse(BaseModel):
    """List response schema"""
    items: List[Ai_alertsResponse]
    total: int
    skip: int
    limit: int


class Ai_alertsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Ai_alertsData]


class Ai_alertsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Ai_alertsUpdateData


class Ai_alertsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Ai_alertsBatchUpdateItem]


class Ai_alertsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Ai_alertsListResponse)
async def query_ai_alertss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query ai_alertss with filtering, sorting, and pagination"""
    logger.debug(f"Querying ai_alertss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Ai_alertsService(db)
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
        logger.debug(f"Found {result['total']} ai_alertss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying ai_alertss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Ai_alertsListResponse)
async def query_ai_alertss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query ai_alertss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying ai_alertss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Ai_alertsService(db)
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
        logger.debug(f"Found {result['total']} ai_alertss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying ai_alertss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Ai_alertsResponse)
async def get_ai_alerts(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single ai_alerts by ID"""
    logger.debug(f"Fetching ai_alerts with id: {id}, fields={fields}")
    
    service = Ai_alertsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Ai_alerts with id {id} not found")
            raise HTTPException(status_code=404, detail="Ai_alerts not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching ai_alerts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Ai_alertsResponse, status_code=201)
async def create_ai_alerts(
    data: Ai_alertsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new ai_alerts"""
    logger.debug(f"Creating new ai_alerts with data: {data}")
    
    service = Ai_alertsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create ai_alerts")
        
        logger.info(f"Ai_alerts created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating ai_alerts: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating ai_alerts: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Ai_alertsResponse], status_code=201)
async def create_ai_alertss_batch(
    request: Ai_alertsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple ai_alertss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} ai_alertss")
    
    service = Ai_alertsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} ai_alertss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Ai_alertsResponse])
async def update_ai_alertss_batch(
    request: Ai_alertsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple ai_alertss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} ai_alertss")
    
    service = Ai_alertsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} ai_alertss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Ai_alertsResponse)
async def update_ai_alerts(
    id: int,
    data: Ai_alertsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing ai_alerts"""
    logger.debug(f"Updating ai_alerts {id} with data: {data}")

    service = Ai_alertsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Ai_alerts with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Ai_alerts not found")
        
        logger.info(f"Ai_alerts {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating ai_alerts {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating ai_alerts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_ai_alertss_batch(
    request: Ai_alertsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple ai_alertss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} ai_alertss")
    
    service = Ai_alertsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} ai_alertss successfully")
        return {"message": f"Successfully deleted {deleted_count} ai_alertss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_ai_alerts(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single ai_alerts by ID"""
    logger.debug(f"Deleting ai_alerts with id: {id}")
    
    service = Ai_alertsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Ai_alerts with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Ai_alerts not found")
        
        logger.info(f"Ai_alerts {id} deleted successfully")
        return {"message": "Ai_alerts deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting ai_alerts {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")