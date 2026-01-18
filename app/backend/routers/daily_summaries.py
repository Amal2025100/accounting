import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.daily_summaries import Daily_summariesService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/daily_summaries", tags=["daily_summaries"])


# ---------- Pydantic Schemas ----------
class Daily_summariesData(BaseModel):
    """Entity data schema (for create/update)"""
    summary_date: date
    total_sales: float
    total_expenses: float
    profit: float
    cash_balance: float


class Daily_summariesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    summary_date: Optional[date] = None
    total_sales: Optional[float] = None
    total_expenses: Optional[float] = None
    profit: Optional[float] = None
    cash_balance: Optional[float] = None


class Daily_summariesResponse(BaseModel):
    """Entity response schema"""
    id: int
    summary_date: date
    total_sales: float
    total_expenses: float
    profit: float
    cash_balance: float

    class Config:
        from_attributes = True


class Daily_summariesListResponse(BaseModel):
    """List response schema"""
    items: List[Daily_summariesResponse]
    total: int
    skip: int
    limit: int


class Daily_summariesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Daily_summariesData]


class Daily_summariesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Daily_summariesUpdateData


class Daily_summariesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Daily_summariesBatchUpdateItem]


class Daily_summariesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Daily_summariesListResponse)
async def query_daily_summariess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query daily_summariess with filtering, sorting, and pagination"""
    logger.debug(f"Querying daily_summariess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Daily_summariesService(db)
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
        logger.debug(f"Found {result['total']} daily_summariess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying daily_summariess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Daily_summariesListResponse)
async def query_daily_summariess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query daily_summariess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying daily_summariess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Daily_summariesService(db)
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
        logger.debug(f"Found {result['total']} daily_summariess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying daily_summariess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Daily_summariesResponse)
async def get_daily_summaries(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single daily_summaries by ID"""
    logger.debug(f"Fetching daily_summaries with id: {id}, fields={fields}")
    
    service = Daily_summariesService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Daily_summaries with id {id} not found")
            raise HTTPException(status_code=404, detail="Daily_summaries not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching daily_summaries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Daily_summariesResponse, status_code=201)
async def create_daily_summaries(
    data: Daily_summariesData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new daily_summaries"""
    logger.debug(f"Creating new daily_summaries with data: {data}")
    
    service = Daily_summariesService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create daily_summaries")
        
        logger.info(f"Daily_summaries created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating daily_summaries: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating daily_summaries: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Daily_summariesResponse], status_code=201)
async def create_daily_summariess_batch(
    request: Daily_summariesBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple daily_summariess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} daily_summariess")
    
    service = Daily_summariesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} daily_summariess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Daily_summariesResponse])
async def update_daily_summariess_batch(
    request: Daily_summariesBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple daily_summariess in a single request"""
    logger.debug(f"Batch updating {len(request.items)} daily_summariess")
    
    service = Daily_summariesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} daily_summariess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Daily_summariesResponse)
async def update_daily_summaries(
    id: int,
    data: Daily_summariesUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing daily_summaries"""
    logger.debug(f"Updating daily_summaries {id} with data: {data}")

    service = Daily_summariesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Daily_summaries with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Daily_summaries not found")
        
        logger.info(f"Daily_summaries {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating daily_summaries {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating daily_summaries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_daily_summariess_batch(
    request: Daily_summariesBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple daily_summariess by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} daily_summariess")
    
    service = Daily_summariesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} daily_summariess successfully")
        return {"message": f"Successfully deleted {deleted_count} daily_summariess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_daily_summaries(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single daily_summaries by ID"""
    logger.debug(f"Deleting daily_summaries with id: {id}")
    
    service = Daily_summariesService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Daily_summaries with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Daily_summaries not found")
        
        logger.info(f"Daily_summaries {id} deleted successfully")
        return {"message": "Daily_summaries deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting daily_summaries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")